import React, { useState, useCallback, useEffect, useMemo } from "react";
import ProfileAdm from '../ProfileAdm';
import { useHistory, Link } from "react-router-dom";
import { FiPower, FiClock } from "react-icons/fi";
import { isToday, format, parseISO, isAfter } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import DayPicker, { DayModifiers } from "react-day-picker";
import "react-day-picker/lib/style.css";

import api from "../../services/api";

import { useAuth } from "../../hooks/auth";


import { DataGrid, ColDef, ValueGetterParams } from '@material-ui/data-grid';

import { render } from "react-dom";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";

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
import Button from "@material-ui/core/Button";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Content,
  Schedule,
  NextAppointment,
  Section,
  Appointment,
  Calender,
} from "./styles";

interface MonthAvailabilityItem {
  day: number;
  available: boolean;
}

interface Appointments {
  id: string;
  date: string;
  hourFormatted: string;
  user: {
    name: string;
    avatar_url: string;
  };
}

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

const Dashboard: React.FC = () => {


  const classes = useStyles();

  const { user, signOut } = useAuth();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [users, setUsers] = useState<Users[]>([]);
  const [idEdit, SetIdEdit] = useState<string>();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthAvailability, setMonthAvailability] = useState<
    MonthAvailabilityItem[]
  >([]);
  const [appointments, setAppointments] = useState<Appointments[]>([]);

  const history = useHistory();


  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available && !modifiers.disabled) {
      setSelectedDate(day);
    }
  }, []);

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, []);

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

  function updateUser(i: number) {
    const id: number = users[i].id;
    setUsers(users.filter(user => user.id !== id));
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
      .get(`/providers/${user.id}/month-availability`, {
        params: {
          year: currentMonth.getFullYear(),
          month: currentMonth.getMonth() + 1,
        },
      })
      .then(response => {
        setMonthAvailability(response.data);
      });

      api
      .get(`/profile/all`)
      .then(response => {
        setUsers(response.data);
        console.log('Aquiiiiiiiiiiii');
        console.log(response.data);
      });

  }, [currentMonth, user.id]);

  useEffect(() => {
    api
      .get<Appointments[]>("/appointments/me", {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then(response => {
        const appointmentsFormatted = response.data.map(appointment => {
          return {
            ...appointment,
            hourFormatted: format(parseISO(appointment.date), "HH:mm"),
          };
        });

        setAppointments(appointmentsFormatted);
      });
  }, [selectedDate]);

  const disabledDays = useMemo(() => {
    const dates = monthAvailability
      .filter(monthDay => monthDay.available === false)
      .map(monthDay => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        return new Date(year, month, monthDay.day);
      });

    return dates;
  }, [currentMonth, monthAvailability]);

  const selectedDateAsText = useMemo(() => {
    return format(selectedDate, "'Dia' dd 'de' MMMM", {
      locale: ptBR,
    });
  }, [selectedDate]);

  const selectedWeekDay = useMemo(() => {
    return format(selectedDate, "cccc", {
      locale: ptBR,
    });
  }, [selectedDate]);

  const morningAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() < 12;
    });
  }, [appointments]);

  const afternoonAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() >= 12;
    });
  }, [appointments]);

  const nextAppointment = useMemo(() => {
    return appointments.find(appointment =>
      isAfter(parseISO(appointment.date), new Date()),
    );
  }, [appointments]);

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
            {users.map((item, i) => {
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
