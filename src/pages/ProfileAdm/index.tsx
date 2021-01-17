import React, { useCallback, useRef, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import { Form } from "@unform/web";
import { FormHandles } from "@unform/core";
import * as Yup from "yup";

import api from "../../services/api";

import { useToast } from "../../hooks/toast";
import { useAuth } from "../../hooks/auth";

import getValidationErrors from "../../utils/getValidationErrors";

import Input from "../../components/Input";
import Button from "../../components/Button";

import { Container, Content } from "./styles";

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

interface UserEdit {
  id: number;
  name: string;
  email: string;
  password: string;
}

const Profile: React.FC<{title:string | undefined}> =  ({children, title}) => {


  const formRef = useRef<FormHandles>(null);

  const [loading, setLoading] = useState(false);

  const [userEdit, setUserEdit] = useState<UserEdit>({} as UserEdit);

  const { addToast } = useToast();
  const { updateUser } = useAuth();

  const history = useHistory();

  useEffect(() => {
    api
    .get(`/profile/adm/${title}`)
    .then(response => {
      setUserEdit(response.data);
    });
  }, [title]);

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required("Nome obrigatório"),
          email: Yup.string()
            .email("Digite um e-mail válido")
            .required("E-mail obrigatório"),
          old_password: Yup.string(),
          password: Yup.string().when("old_password", {
            is: val => !!val.length,
            then: Yup.string().required("Campo obrigatório"),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string()
            .when("old_password", {
              is: val => !!val.length,
              then: Yup.string().required("Campo obrigatório"),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref("password"), null], "Confirmação incorreta"),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        setLoading(true);

        history.push("/dashboard-adm");

        addToast({
          type: "success",
          title: "Perfil atualizado",
          description:
            "Suas informações do perfil foram atualizados com sucesso",
        });

        setLoading(false);

        history.push("/");
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          setLoading(false);

          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: "error",
          title: "Erro na atualização",
          description:
            "Ocorreu um erro ao atualizar seus dados, tente novamente",
        });
      }
    },
    [addToast, history],
  );

  return (
    <Container>
  
      <Content>
        <Form
          ref={formRef}
          initialData={{
            name: userEdit.name,
            email: userEdit.email,
          }}
          onSubmit={handleSubmit}
        >
          {/*<AvatarInput>
             <img src={user.avatar_url} alt={user.name} /> 
            <label htmlFor="avatar">
              <FiCamera />

              <input type="file" id="avatar" onChange={handleAvatarChange} />
            </label>
          </AvatarInput>*/}
          <br></br><br></br><br></br><br></br><br></br><br></br><br></br>
          <h1>Meu perfil</h1>

          <Input name="name" icon={FiUser} type="text" placeholder="Nome" />
          <Input name="email" icon={FiMail} type="text" placeholder="E-mail" />

          <Input
            name="old_password"
            icon={FiLock}
            type="password"
            placeholder="Senha atual"
          />

          <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder="Nova senha"
          />

          <Input
            name="password_confirmation"
            icon={FiLock}
            type="password"
            placeholder="Confirmar senha"
          />

          <Button loading={loading} type="submit">
            Confirmar mudanças
          </Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;
