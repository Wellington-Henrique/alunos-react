//*
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import LogoCadastro from './assets/cadastro-ico.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const baseUrl = "https://localhost:44311/api/alunos";
  const [data, setData] = useState([]);

  const pedidoGet = async() => {
    await axios.get(baseUrl)
    .then(response => setData(response.data))
    .catch(error => {
      console.log(error)
    })
  }

  useEffect(()=> {
    pedidoGet();
  });

  return (
    <div className="App">
      <h3>Cadastro de Alunos</h3>

      <header className="">
        <img src={LogoCadastro} alt="Cadastro"></img>
        <button className="btn btn-success" onClick={() => console.log("Clicou...")}>Incluir Novo Aluno</button>
      </header>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Idade</th>
            <th>Opoeração</th>
          </tr>
        </thead>
        <tbody> 
          {data.map(aluno => (
            <tr key={aluno.id}>
              <td>{aluno.id}</td>
              <td>{aluno.nome}</td>
              <td>{aluno.email}</td>
              <td>{aluno.idade}</td>
              <td>
                <button className="btn btn-primary me-2" onClick={() => console.log("Clicou...")}>Editar</button>
                <button className="btn btn-danger" onClick={() => console.log("Clicou...")}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
