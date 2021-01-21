import React, { useState,  useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { FiPower } from "react-icons/fi";
import "react-day-picker/lib/style.css";
import Modal from '@material-ui/core/Modal';
import ModalLog from '@material-ui/core/Modal';

import api from "../../services/api";

import { useAuth } from "../../hooks/auth";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";

import ModalUpdateAvatar from '../ModalUpdateAvatar';
import ModalLogAvatar from '../ModalLogAvatar';

import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';


import Paper from "@material-ui/core/Paper";

import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Content,
  Schedule
} from "./styles";

interface Files {
  id_arquivo: number;
  cod_user: string;
  nome_arquivo: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }),
);


const Dashboard: React.FC = () => {

  const classes = useStyles();

  const { user, signOut } = useAuth();

  const [log, setLog] = useState<boolean>();
  const [files, setFiles] = useState<Files[]>([]);

  function deleteItem(i: number) {
    const id: number = files[i].id_arquivo;
    setFiles(files.filter(file => file.id_arquivo !== id));

    api
      .delete(`/files/${files[i].id_arquivo}`)
      .then(response => {
        console.log('Deu certo');
      });
  }

  const handleOpen = (i: number) => {
    let idFiles = files[i].id_arquivo;
    SetIdEdit(String(idFiles));
    setLog(false);
    setOpen(true);
  };

  const handleOpenLog = (i: number) => {
    setLog(true);
    let idFiles = files[i].id_arquivo;
    SetIdEdit(String(idFiles));
    setOpen(true);
  };
  

  const handleViewOpen = (i: number) => {
    console.log(files[i]);
    const link = 'https://web-validador-dsn.s3.amazonaws.com/' + files[i].nome_arquivo;
    window.open(link);

    //let idUser = users[i].id;
    //SetIdEdit(String(idUser));
    //setOpen(true);
  };
  
  const [idEdit, SetIdEdit] = useState<string>();


  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const [cardFile, setCardFile] = useState<any>();

  const history = useHistory();

  useEffect(() => {

    if(user && user.acesso === '1') {
      history.push("/dashboard-adm");
    }

    api
    .get(`/files`)
    .then(response => {
      console.log(response.data);
      setFiles(response.data);
    });
    

  }, [history, user]);

  function rand() {
    return Math.round(Math.random() * 20) - 10;
  }

  function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }

  let body: any = null;

  if(!log) {
    body = (
      <div style={modalStyle} className={classes.paper}>
        <h2 id="simple-modal-title">Text in a modal</h2>
        <p id="simple-modal-description">
          Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
        </p>
          <ModalUpdateAvatar title={idEdit}/>
      </div>
    );
  } else {
    body = (
      <div style={modalStyle} className={classes.paper}>
        <h2 id="simple-modal-title">Text in a modal</h2>
        <p id="simple-modal-description">
          Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
        </p>
          <ModalLogAvatar title={idEdit}/>
      </div>
    );
  }

  const handleUploadFile = (e: any) => setCardFile(e.target.files[0]);

  const addNewCard = async () => {
    //setSaving(true);
    const data = new FormData();
    data.append("avatar", cardFile);

    const newFile = files;
    api
    .patch(`/files/avatar/`, data)
    .then(response => {
      newFile.push(response.data);
      setFiles(newFile);
      history.push('/');
    });
    

    // ------------------------------------------------------------
    // ...
    // Inserimos aqui nossa chamada POST/PUT
    // para enviarmos nosso arquivo.
  };

  return (
    <Container>
      <Header>
        <HeaderContent>
          {/*<img src={logo} alt="GoBarber" /> */}

          <Profile>
            {/*<img src={user.avatar_url} alt={user.name} /> */}

            <div>
              <span>Bem-vindo ao perfil, </span>
              <Link to="/profile">
                <strong>{user.name}</strong>
              </Link>
            </div>
          </Profile>

          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <Schedule>
          <h1>Gerenciamento de Arquivos</h1><br></br><br></br><br></br>


          <input name="foo" type="file" onChange={handleUploadFile} accept="image/jpeg,image/png,application/pdf"/>
          <br></br><br></br>      
          <button onClick={addNewCard}>Enviar Arquivo</button>

        <br></br><br></br>

        <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código Arquivo</TableCell>
              <TableCell>Arquivo</TableCell>
              <TableCell>Visualizar</TableCell>
              <TableCell>Deletar</TableCell>
              <TableCell>Atualizar</TableCell>
              <TableCell>Log</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {files.map((file, i) => {
              return (
                <TableRow key={`row-${i}`}>
                  <TableCell>{file.id_arquivo}</TableCell>
                  <TableCell>{file.nome_arquivo}</TableCell>
                  <TableCell>
                    <VisibilityIcon
                      type='button'
                      onClick={() => handleViewOpen(i)}
                      color="secondary"
                    >
                      Vizualizar
                    </VisibilityIcon>
                 </TableCell>
                  <TableCell>
                    <DeleteIcon
                      type='button'
                      onClick={() => deleteItem(i)}
                      color="secondary"
                    >
                      Delete
                    </DeleteIcon>
                    </TableCell>
                  <TableCell>
                    <EditIcon
                      type='button'
                      onClick={() => handleOpen(i)}
                      color="secondary"
                    >
                      Atualizar
                    </EditIcon>
                    </TableCell>
                    <TableCell>

                    <EditIcon
                      type='button'
                      onClick={() => handleOpenLog(i)}
                      color="secondary"
                    >
                      Log
                    </EditIcon>

                    </TableCell>

                 <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>


                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
        </Schedule>
          {/*
        <Calender>
          <DayPicker
            weekdaysShort={["D", "S", "T", "Q", "Q", "S", "S"]}
            fromMonth={new Date()}
            disabledDays={[{ daysOfWeek: [0, 6] }, ...disabledDays]}
            modifiers={{
              available: { daysOfWeek: [1, 2, 3, 4, 5] },
            }}
            onMonthChange={handleMonthChange}
            selectedDays={selectedDate}
            onDayClick={handleDateChange}
            months={[
              "Janeiro",
              "Fevereiro",
              "Março",
              "Abril",
              "Maio",
              "Junho",
              "Julho",
              "Agosto",
              "Setembro",
              "Outubro",
              "Novembro",
              "Dezembro",
            ]}
          />
        </Calender>
          */}
      </Content>
    </Container>
  );
};

export default Dashboard;
