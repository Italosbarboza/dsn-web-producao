import React, { useState, useEffect } from "react";
import ProfileAdm from '../ProfileAdm';
import { useHistory, Link } from "react-router-dom";
import { FiPower } from "react-icons/fi";
import "react-day-picker/lib/style.css";

import api from "../../services/api";

import { useAuth } from "../../hooks/auth";

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";

import Paper from "@material-ui/core/Paper";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Content,
  Schedule
} from "./styles";

interface Users {
  id: number;
  name: string;
  email: string;
  password: string;
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

interface Users {
  id: number;
  name: string;
  email: string;
  password: string;
}

const Dashboard: React.FC = () => {
  const galinha: Users = {id:1, name:'Italo', email:'e', password: 'e'}

  const classes = useStyles();

  const { user, signOut } = useAuth();

  const [users, setUsers] = useState<Users[]>([]);
  const [idEdit, SetIdEdit] = useState<string>();

  const history = useHistory();

  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const handleOpen = (i: number) => {
    let idUser = users[i].id;
    SetIdEdit(String(idUser));
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function rand() {
    return Math.round(Math.random() * 20) - 10;
  }

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <h2 id="simple-modal-title">Text in a modal</h2>
      <p id="simple-modal-description">
        Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
      </p>
       <ProfileAdm title={idEdit}/>
    </div>
  );
  
  function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }

  function deleteItem(i: number) {
    console.log(i);
    const id: number = users[i].id;
    setUsers(users.filter(user => user.id !== id));

    api
      .delete(`/profile/${users[i].id}`)
      .then(response => {
        console.log('Deu certo');
      });
  }

  function addUser() {
    console.log('Chegou aqui');
    history.push('/adm/create-new-user');
  }
  
  useEffect(() => {
    if(user && user.acesso !== '1') {
      history.push("/dashboard");
    }

    api
    .get(`/profile/all`)
    .then(response => {
      setUsers(response.data);
      console.log(response.data);
    });

  }, [history, user]);

  return (
    <Container>
      <Header>
        <HeaderContent>
          {/*<img src={logo} alt="GoBarber" /> */}

          <Profile>
            {/*<img src={user.avatar_url} alt={user.name} /> */}

            <div>
              <span>Bem-vindo ao perfil de administrador, </span>
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
          <h1>Gerenciamento de Usuários</h1><br></br>

          <PersonAddIcon
            type='button'
            onClick={() => addUser()}
            color="secondary">
          </PersonAddIcon>

          <br></br><br></br>

          <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Deletar</TableCell>
              <TableCell>Atualizar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!users ? null : users.map((item, i) => {
              return (
                <TableRow key={`row-${i}`}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.email}</TableCell>
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
          {/*
          <p>
            {isToday(selectedDate) && <span>Hoje</span>}
            <span>{selectedDateAsText}</span>
            <span>{selectedWeekDay}</span>
          </p>

          {isToday(selectedDate) && nextAppointment && (
            <NextAppointment>
              <strong>Agendamento a seguir</strong>
              <div>
                <img
                  src={nextAppointment.user.avatar_url}
                  alt={nextAppointment.user.name}
                />

                <strong>{nextAppointment.user.name}</strong>
                <span>
                  <FiClock />
                  {nextAppointment.hourFormatted}
                </span>
              </div>
            </NextAppointment>
          )}

          <Section>
            <strong>Manhã</strong>

            {morningAppointments.length === 0 && (
              <p>Nenhum agendamento no horário da manhã</p>
            )}

            {morningAppointments.map(appointment => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {appointment.hourFormatted}
                </span>

                <div>
                  <img
                    src={appointment.user.avatar_url}
                    alt={appointment.user.name}
                  />

                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>

          <Section>
            <strong>Tarde</strong>

            {afternoonAppointments.length === 0 && (
              <p>Nenhum agendamento no horário da tarde</p>
            )}

            {afternoonAppointments.map(appointment => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {appointment.hourFormatted}
                </span>

                <div>
                  <img
                    src={appointment.user.avatar_url}
                    alt={appointment.user.name}
                  />

                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>
            */}
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
