import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LoginUser, reset } from "../features/authSlice";
import wave from "../assets/images/wave2.png"
import welcome from "../assets/images/welcome.svg"
//import avatar from "../assets/images/avatar.svg"
import logo from "../assets/images/logo.png";
import "../assets/styles/login.css"

import { IonIcon } from '@ionic/react';
import {
  personCircleOutline,
  lockClosedOutline
} from 'ionicons/icons';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isError, isSuccess, isLoading, message } = useSelector(
    (state) => state.auth
  );
  

  useEffect(() => {
    if (user || isSuccess) {
      navigate("/dashboard");
    }
    dispatch(reset());
  }, [user, isSuccess, dispatch, navigate]);

  const Auth = (e) => {
    e.preventDefault();
    dispatch(LoginUser({ email, password }));
  };

  return (
    <section >
      <img className="wave" src={wave} />
      <div className="container">

        <div className="img img-welcome">
          <img src={welcome} />
        </div>

        <div className="login-content">
          <form onSubmit={Auth} className="form-login">
            <img src={logo} />
            {isError && <p style={{color:'red'}}>{message}</p>}
            <h2 className="title-welcome">Bienvenido</h2>

            <div className="input-div one">
              <div className="icon-login">
              <IonIcon icon={personCircleOutline} />
              </div>
              <div className="div">
                <input
                  type="text"
                  className="input"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}

                />
              </div>
            </div>

            <div className="input-div pass">
              <div className="icon-login">
              <IonIcon icon={lockClosedOutline} />
              </div>
              <div className="div">
                <input
                  type="password"
                  className="input"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}

                />
              </div>
            </div>

            <div >
              <button type="submit" className="button-login">
                {isLoading ? "Loading..." : "Login"}
              </button>
            </div>

          </form>
        </div>
      </div>



    </section>
  );
};

export default Login;
