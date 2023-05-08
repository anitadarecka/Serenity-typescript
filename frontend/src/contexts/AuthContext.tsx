import { createContext, useContext, useEffect, useState } from "react";
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

interface User {
  email: string; 
  firstname: string;
  id: number;
  lastname: string;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const authContext = createContext({});

export function AuthProvider({ children }: AuthProviderProps) {
  const { Provider } = authContext;
  const [onePatient, setOnePatient] = useState({});
  const [oneDoctor, setOneDoctor] = useState<Doctor>({email: "",
    firstname: "",
    genre: "",
    id: 0,
    image: "",
    languages: "",
    lastname: "",
    phone: "",
    specialization: "",
  });
  const [userEmail, setUserEmail] = useState("");
  const [documents, setDocuments] = useState([]);
  const [role, setRole] = useState<number | null>();
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

  const noUser = {
    email: "", 
    firstname: "",
    id: 0,
    lastname: "",
  }

  const [loginData, setLoginData] = useState<User>({ noUser });

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
    setLoginData({  email: "", 
      firstname: "",
      id: 0,
      lastname: ""});
    setOneDoctor({});
    setOnePatient({});
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

  const [valeur, setValeur] = useState([]);
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
