import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Link, useHistory } from "react-router-dom";
import { DayModifiers } from "react-day-picker";
import "react-day-picker/lib/style.css";
import Valido from "./valido";
import Invalido from "./invalido";



import api from "../../services/api";

import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';


import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';


import {
  Container,
  Header,
  HeaderContent,
  Profile,
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


const Dashboard: React.FC = () => {

  const classes = useStyles();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [idEdit, SetIdEdit] = useState<string>();
  const [valueFile, SetValueFile] = useState<string>();
  const [valueMotivo, SetMotivo] = useState<string>();
  const [valido, SetValido] = useState<boolean>();
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
  let body;
  
  if(valido) {
     body = (
      <div style={modalStyle} className={classes.paper}>
        <h2 id="simple-modal-title">Text in a modal</h2>
        <p id="simple-modal-description">
          Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
        </p>
        <Valido></Valido>
      </div>
    );
  } else {
     body = (
      <div style={modalStyle} className={classes.paper}>
        <h2 id="simple-modal-title">Text in a modal</h2>
        <p id="simple-modal-description">
          Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
        </p>
        <Invalido></Invalido>
      </div>
    );
  }
  
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
          SetValido(true);
          setOpen(true);
        } else {
          SetValido(false);
          setOpen(true);
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
      <Header>
        <HeaderContent>
          {/*<img src={logo} alt="GoBarber" /> */}

          <Profile>
            {/*<img src={user.avatar_url} alt={user.name} /> */}

            <div>
              <Link to="/profile">
              </Link>
            </div>
          </Profile>

        </HeaderContent>
      </Header>

      <Content>
        <Schedule>
          <h1>Autenticação de Arquivos</h1><br></br><br></br><br></br>


          <div >
          <TextField
          id="outlined-full-width"
          label="Código do arquivo"
          style={{ margin: 8 }}
          placeholder="Digite o código do arquivo"
          fullWidth
          margin="normal"
          onChange={e => handleChange(e)}
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
        /></div>
                  <p>Escolha o arquivo que você quer comparar</p>
          <br></br>
          <input name="foo" type="file" onChange={handleUploadFile} accept="image/jpeg,image/png,application/pdf"/>
          <br></br><br></br>
          <TextField
          id="filled-multiline-static"
          label="Motivo para a autenticação"
          multiline
          style={{ width: '102%'}}
          rows={12}
          onChange={e => handleChangeMotivo(e)}
          defaultValue="Motivo"
          variant="filled"
        />
          <br></br><br></br>      
          <Button variant="contained" color="primary" onClick={addNewCard}>Enviar Arquivo</Button>

        <br></br><br></br>


        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
        </Schedule>
      </Content>
    </Container>
  );
};

export default Dashboard;
