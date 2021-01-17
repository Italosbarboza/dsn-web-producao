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

//import logo from "../../assets/logo.svg";

import Input from "../../components/Input";
import Button from "../../components/Button";

import { Container, Content, AnimationContainer, Background } from "./styles";

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { user } = useAuth();

  const [loading, setLoading] = useState(false);

  const { addToast } = useToast();

  const history = useHistory();

  useEffect(() => {
    if(user && user.acesso !== '1') {
      history.push("/dashboard");
    }
  }, [history]);

  const handleSubmit = useCallback(
    async (data: SignUpFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required("Nome obrigatório"),
          email: Yup.string()
            .email("Digite um e-mail válido")
            .required("E-mail obrigatório"),
          password: Yup.string().min(6, "No mínimo 6 digitos"),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        setLoading(true);

        await api.post("users", data);

        addToast({
          type: "success",
          title: "Cadastro realizado",
          description: "Ok",
        });

        setLoading(false);

        history.push("/dashboard-adm");
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          setLoading(false);

          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: "error",
          title: "Erro no cadastro",
          description: "Ocorreu um erro ao fazer cadastro, cheque os dados do novo usuário novamente",
        });
      }
    },
    [addToast, history],
  );

  return (
    <Container>
      <Background />

      <Content>
        <AnimationContainer>
          {/*<img src={logo} alt="GoBarber" /> */}

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça o cadastro de um novo usuário</h1>

            <Input name="name" icon={FiUser} type="text" placeholder="Nome" />
            <Input
              name="email"
              icon={FiMail}
              type="text"
              placeholder="E-mail"
            />
            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Senha"
            />

            <Button loading={loading} type="submit">
              Cadastrar
            </Button>
          </Form>
{/*
          <Link to="/">
            <FiArrowLeft />
            Voltar para Acesso
          </Link>
  */}
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default SignUp;
