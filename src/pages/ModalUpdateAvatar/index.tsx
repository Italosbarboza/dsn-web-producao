import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "react-day-picker/lib/style.css";
import api from "../../services/api";

import {
  Container,
  Schedule
} from "./styles";

const ModalUpdateAvatar: React.FC<{title:string | undefined}> =  ({children, title}) => {

  const [cardFile, setCardFile] = useState<any>();

  const history = useHistory();

  const handleUploadFile = (e: any) => setCardFile(e.target.files[0]);

  const addNewCard = async () => {

    //setSaving(true);
    const data = new FormData();
    data.append("avatar", cardFile);

    console.log(data);

    api
    .put(`/files/arquivo/${title}`, data)
    .then(response => {
    });

    history.push("/");


    // ------------------------------------------------------------
    // ...
    // Inserimos aqui nossa chamada POST/PUT
    // para enviarmos nosso arquivo.
  };

  return (
    <Container>
      

        <Schedule>
          <p>Escolha arquivo para atualização</p><br></br><br></br><br></br>
          


          <input name="foo" type="file" onChange={handleUploadFile} accept="image/jpeg,image/png,application/pdf"/>
          <br></br><br></br>      
          <button onClick={addNewCard}>Enviar Arquivo</button>

        <br></br><br></br>

        
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
    </Container>
  );
};

export default ModalUpdateAvatar;
