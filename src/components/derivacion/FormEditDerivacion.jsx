import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const FormEditDerivacion = () => {
  const [name, setNombre] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getDerivacionById = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/dericacion/${id}`
        );
        setNombre(response.data.name);
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
        }
      }
    };
    getDerivacionById();
  }, [id]);

  const updateDerivacion = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:5000/dericacion/${id}`, {
        name: name
      });
      navigate("/derivaciones");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  return (
    <div>
      <h1 className="title">Derivacions</h1>
      <h2 className="subtitle">Edit Derivacion</h2>
      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content">
            <form onSubmit={updateDerivacion}>
              <p className="has-text-centered">{msg}</p>
              <div className="field">
                <label className="label">Name</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={name}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="input"
                  />
                </div>
              </div>
              

              <div className="field">
                <div className="control">
                  <button type="submit" className="button is-success">
                    Update
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormEditDerivacion;
