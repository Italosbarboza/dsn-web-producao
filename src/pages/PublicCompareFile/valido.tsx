import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { DayModifiers } from "react-day-picker";
import "react-day-picker/lib/style.css";

import api from "../../services/api";

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';


import {
  Container,
  Content,
  Schedule
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


const Valido: React.FC = () => {

  const classes = useStyles();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [idEdit, SetIdEdit] = useState<string>();
  const [valueFile, SetValueFile] = useState<string>();
  const [valueMotivo, SetMotivo] = useState<string>();
  const [modalStyle] = React.useState(getModalStyle);

  const [open, setOpen] = React.useState(false);


  const [monthAvailability, setMonthAvailability] = useState<
    MonthAvailabilityItem[]
  >([]);
  const [appointments, setAppointments] = useState<Appointments[]>([]);
  const [cardFile, setCardFile] = useState<any>();


  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available && !modifiers.disabled) {
      setSelectedDate(day);
    }
  }, []);

  const history = useHistory();

  function handleChange(e: any) {
    SetValueFile(e.target.value);
  }

  function handleChangeMotivo(e: any) {
    SetMotivo(e.target.value);
  }


  useEffect(() => {
  }, []);

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

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <h2 id="simple-modal-title">Text in a modal</h2>
      <p id="simple-modal-description">
        Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
      </p>
      <p>Arquivo é válido</p>
    </div>
  );


  const handleUploadFile = (e: any) => setCardFile(e.target.files[0]);

  const handleClose = () => {
    setOpen(false);
  };

  const addNewCard = async () => {
    const data = new FormData();
    data.append("avatar", cardFile);

    api
    .post(`/files/arquivo/${valueFile}`, data)
    .then(response => {
        if(response.data) {
          setOpen(true);
          alert('Arquivo é autêntico!');
        } else {
          alert('Arquivo não é autêntico!');
        }
    }).catch(function (error) {
      if (error.response) {
        // Request made and server responded
        alert('Arquivo não existe, código do arquivo pode está errado'); 
    }})
    

    // ------------------------------------------------------------
    // ...
    // Inserimos aqui nossa chamada POST/PUT
    // para enviarmos nosso arquivo.
  };

   
  
  return (
    <Container>

      <Content>
        <Schedule>
        <img src="https://blog.maxieduca.com.br/wp-content/uploads/2015/08/correto.png" alt="Girl in a jacket"width="70%" height="70%" />
        
                  <p>Arquivo válido</p>          
        </Schedule>
      </Content>
    </Container>
  );
};

export default Valido;
