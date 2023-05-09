/* eslint-disable import/no-unresolved */
import React, { MouseEventHandler, useEffect, useState } from "react";
import Btn from "../components/components_reutilisable/Btn";
import { MdNavigateBefore } from "react-icons/md";
import Range from "../components/quizz/Range";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";

interface Patient {
  birth_date: string;
  birth_place: string;
  children: number;
  city: string;
  country: string;
  email: string;
  family_status: string;
  firstname: string;
  genre: string;
  id: number;
  image: string;
  languages: string;
  lastname: string;
  maiden_name: string;
  mobile: string;
  postal_code: string;
  profession: string;
  sex: string;
  situation_pro: string;
  social_number: string;
  status: string;
  street: string;
  tel_fixe: string;
  test: null;
}

interface AuthContextType {
  onePatient?: Patient;
  valeur2?: number;
  getValeur?: () => void;
}

type Ask = {
  id: number;
  category: string;
  description: string;
};

function FirstQuizz() {
  const navigate = useNavigate();
  const { onePatient, valeur2, getValeur }: AuthContextType = useAuth();
  const [current, setCurrent] = useState(0);
  const [data, setData] = useState(50);
  const [ask, setAsk] = useState<Ask[]>();
  const getAsk = () => {
    const url = "/question";
    api.get(url).then((response) => {
      setAsk(response.data);
    });
  };
  useEffect(() => {
    getAsk();
  }, []);
  const handleNext = (event) => {
    if (onePatient && ask) {
      setCurrent(current + 1);
      event.preventDefault();
      setData(50);
      const patientId = onePatient.id;
      const questionId = ask[current].id;
      const valeur = data;
      const url = "/question_result";
      api.post(url, {
        patient_id: patientId,
        question_id: questionId,
        valeur,
      });
    }
  };
  const handleEnd = (event) => {
    event.preventDefault();
    if (onePatient && ask) {
      const patientId = onePatient.id;
      const questionId = ask[current].id;
      const valeur = data;
      const url = "/question_result";
      api
        .post(url, {
          patient_id: patientId,
          question_id: questionId,
          valeur,
        })
        .then((res) => {
          if (res.status === 201 && getValeur) {
            navigate("/comprendre_mon_operation");
            getValeur();
          }
        });
    }
  };
  const handleClick = () => {
    navigate("/comprendre_mon_operation");
  };
  const handleBefore: MouseEventHandler<HTMLButtonElement> = (event) => {
    setCurrent(current - 1);
    event.preventDefault();
    setData(50);
  };
  useEffect(() => {
    if (valeur2 !== null) {
      navigate("/comprendre_mon_operation");
    }
  }, [valeur2]);
  return (
    <div className="pt-8 h-screen w-screen z-50 bg-white absolute">
      <div className="flex justify-around items-center">
        <Btn
          color="text-violet-two text-5xl"
          handleClick={handleBefore}
          type="button"
          label={<MdNavigateBefore />}
        />
        <div className="w-[40vmin] h-[3vmin] ml-8 rounded-lg lg:rounded-2xl bg-input-progress">
          {ask && (
            <div
              className="h-[100%] rounded-lg lg:rounded-2xl bg-violet-two duration-[2000ms]"
              style={{ width: `${(current / ask.length) * 120}%` }}
            />
          )}
        </div>
        <Btn
          color="text-violet-two text-2xl"
          handleClick={handleClick}
          label="Passer"
          type="button"
        />
      </div>
      <div className="w-[80%] m-auto mt-20 lg:mt-8">
        {ask && (
          <>
            <h3 className="flex justify-center text-violet-two font-rubik text-[5vmin] lg:text-[3vmin]">
              Step {current + 1}/{ask.length}
            </h3>
            <h1 className="text-[7vmin] lg:text-[5vmin] text-center mt-6 text-font-primary">
              {ask[current]?.category}
            </h1>
            <h2 className="text-[4.5vmin] lg:text-[3.5vmin] text-center m-auto mt-6 text-font-blue">
              {ask[current]?.description}
            </h2>
          </>
        )}
      </div>
      <Range
        handleNext={handleNext}
        current={current}
        data={data}
        setData={setData}
        ask={ask}
        handleEnd={handleEnd}
      />
    </div>
  );
}

export default FirstQuizz;
