import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import propTypes from "prop-types";
import api from "../services/api";

type Doctor = {
  email: string;
  firstname: string;
  genre: string;
  id: number;
  image: string;
  languages: string;
  lastname: string;
  phone: string;
  specialization: string;
}

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

interface User {
  email: string; 
  firstname: string;
  id: number;
  lastname: string;
}

type LoginData = {
  data: User;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

interface Document {
  birth_date: string;
  birth_place: string;
  checked: number;
  children: number;
  city: string;
  country: string;
  document_id: number;
  email: string;
  family_status: string;
  firstname: string;
  genre: string;
  id: number;
  image: string;
  languages: string;
  lastname: string;
  maiden_name: string;
  mandatory: number;
  mobile: string;
  patient_id: number;
  postal_code: string;
  profession: string;
  sex: string;
  situation_pro: string;
  social_number: string;
  status: string;
  street: string;
  tel_fixe: string;
  test: null;
  type: string;
}

type Valeur = {
  average: string | null;
}

const authContext = createContext({});

export function AuthProvider({ children }: AuthProviderProps) {
  const user = {
    email: "", 
    firstname: "",
    id: 0,
    lastname: "",
  }  
  const patient = {
    birth_date: "",
    birth_place: "",
    children: 0,
    city: "",
    country: "",
    email: "",
    family_status: "",
    firstname: "",
    genre: "",
    id: 0,
    image: "",
    languages: "",
    lastname: "",
    maiden_name: "",
    mobile: "",
    postal_code: "",
    profession: "",
    sex: "",
    situation_pro: "",
    social_number: "",
    status: "",
    street: "",
    tel_fixe: "",
    test: null,
  }
  const doctor = {
    email: "",
    firstname: "",
    genre: "",
    id: 0,
    image: "",
    languages: "",
    lastname: "",
    phone: "",
    specialization: "",
  };
  const { Provider } = authContext;
  const [onePatient, setOnePatient] = useState<Patient>(patient);
  const [oneDoctor, setOneDoctor] = useState<Doctor>(doctor);
  const [userEmail, setUserEmail] = useState("");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [role, setRole] = useState<number | null>(null);
  const [refresh, setRefresh] = useState(false);
  const roleCheck = () => {
    const url = "/users/roleCheck";
    api.get(url, { withCredentials: true }).then((response) => {
      setRole(response.data[0].id);
    });
  };
  const authCheck = () => {
    api
      .get("/users/authCheck", {
        withCredentials: true,
      })
      .then((res) => {
        if (res.status === 200) {
          setUserEmail(res.data);
        }
      })
      .catch((err) => {
        window.localStorage.removeItem("user");
        console.error(err);
      });
  };
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState<LoginData>({ data: user });

  const getOnePatient = () => {
    const url = "/patients/email";
    api.get(url, { withCredentials: true }).then((response) => {
      setOnePatient(response.data[0]);
    });
  };

  const getOneDoctor = () => {
    const url = "/doctors/email";
    api.get(url, { withCredentials: true }).then((response) => {
      setOneDoctor(response.data);
    });
  };

  const login = (data: User) => {
    setLoginData({ data });
    roleCheck();
    authCheck();
    getOnePatient();
    getOneDoctor();
  };

  const logout = () => {
    setLoginData({ data: user });
    setOneDoctor(doctor);
    setOnePatient(patient);
    window.localStorage.removeItem("user");
    setRole(null);
    navigate("/");
  };

  useEffect(() => {
    authCheck();
    roleCheck();
    const data = window.localStorage.getItem("user");

    if (data) {
      setLoginData({ data: JSON.parse(data) });
    }
  }, []);

  useEffect(() => {
    if (loginData.data) {
      window.localStorage.setItem("user", JSON.stringify(loginData.data));
    }
  }, [loginData]);

  const getDocuments = () => {
    if (onePatient.id) {
      api
        .get(`/documents/patient/${onePatient.id}`, {
          withCredentials: true,
        })
        .then((document) => {
          setDocuments(document.data);
        });
    }
  };

  const pourcentage = () => {
    const total = documents.length;
    const checked = documents.filter(
      (document) => document.checked === 1
    ).length;
    const value = (checked / total) * 100;
    return Math.round(value);
  };
  useEffect(() => {
    if (onePatient) {
      getDocuments();
      pourcentage();
    }
  }, [onePatient, refresh]);

  const [valeur, setValeur] = useState<Valeur>({ average: null });
  const getValeur = () => {
    if (onePatient.id !== undefined) {
      const url = `/question_result/${onePatient.id}`;
      api
        .get(url, {
          withCredentials: true,
        })
        .then((response) => {
          setValeur(response.data);
        });
    }
  };
  useEffect(() => {
    if (onePatient) {
      getValeur();
    }
  }, [valeur.average, onePatient]);

  return (
    <Provider
      value={{
        loginData,
        login,
        logout,
        authCheck,
        role,
        roleCheck,
        userEmail,
        onePatient,
        setOnePatient,
        getOneDoctor,
        getOnePatient,
        oneDoctor,
        valueChecklist: pourcentage(),
        valeur2: valeur.average,
        getValeur,
        refresh,
        setRefresh,
      }}
    >
      {children}
    </Provider>
  );
}

AuthProvider.propTypes = {
  children: propTypes.element.isRequired,
};

export const useAuth = () => useContext(authContext);
