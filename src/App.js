import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import LogoCadastro from './assets/cadastro-ico.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const baseUrl = "https://localhost:44311/api/alunos";

const initialState = {
  id: '',
  nome: '',
  email: '',
  idade: ''
};

function App() {
  const [data, setData] = useState([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState(initialState);
  const [modalIncluir, setModalIncluir] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalDeletar, setModalDeletar] = useState(false);

  const selecionarAluno = (aluno, opcao) => {
    setAlunoSelecionado(aluno);
    (opcao === "Editar") ? 
    abrirFecharModalEditar() : abrirFecharModalDeletar();
  }

  const abrirFecharModalIncluir = () => {
    setModalIncluir(!modalIncluir);
  }

  const abrirFecharModalEditar = () => {
    setModalEditar(!modalEditar);
  }

  const abrirFecharModalDeletar = () => {
    setModalDeletar(!modalDeletar);
  }

  const handleChange = e => {
    const {name, value} = e.target;
    setAlunoSelecionado({
      ...alunoSelecionado, [name]:value
    });
    console.log(alunoSelecionado);
  }

  const pedidoGet = async() => {
    await axios.get(baseUrl)
    .then(response => setData(response.data))
    .catch(error => {
      console.log(error)
    })
  }

  const pedidoPost = async() => {
    delete alunoSelecionado.id;
    alunoSelecionado.idade = parseInt(alunoSelecionado.idade);

    await axios.post(baseUrl, alunoSelecionado)
    .then(response => {
      setData(data.concat(response.data));
      abrirFecharModalIncluir();
    })
    .catch(error => {
      console.log(error)
    })
  }

  const pedidoPut = async() => {
    alunoSelecionado.idade = parseInt(alunoSelecionado.idade);
    await axios.put(`${baseUrl}/${alunoSelecionado.id}`, alunoSelecionado)
    .then(response => {
      var resposta = response.data;
      var dadosAuxiliar = data;

      dadosAuxiliar.map(aluno => {
        if (aluno.id === alunoSelecionado.id){
          aluno.nome = resposta.nome;
          aluno.email = resposta.email;
          aluno.idade = resposta.idade;
        }
      });
      abrirFecharModalEditar();
      pedidoGet();
    })
    .catch(error => {
      console.log(error)
    })
  }

  const pedidoDelete = async() => {
    await axios.delete(`${baseUrl}/${alunoSelecionado.id}`)
    .then(response => {
      setData(data.filter(aluno => aluno.id !== response.data));
      abrirFecharModalDeletar();
      pedidoGet();
    })
    .catch(error => {
      console.log(error)
    })
  }

  useEffect(()=> {
    pedidoGet();
  }, []);

  return (
    <div className="aluno-container">
      <h3>Cadastro de Alunos</h3>

      <header className="">
        <img src={LogoCadastro} alt="Cadastro"></img>
        <button className="btn btn-success" onClick={() => abrirFecharModalIncluir()}>Incluir Novo Aluno</button>
      </header>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Idade</th>
            <th>Operação</th>
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
                <button className="btn btn-primary me-2" onClick={() => selecionarAluno(aluno, "Editar")}>Editar</button>
                <button className="btn btn-danger" onClick={() => selecionarAluno(aluno, "Excluir")}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={modalIncluir}>
        <ModalHeader>Incluir Alunos</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nome:</label>
            <br/>
            <input type="text" className="form-control" name="nome" onChange={handleChange}/>
            <label>Email:</label>
            <br/>
            <input type="text" className="form-control" name="email" onChange={handleChange}/>
            <label>Idade:</label>
            <br/>
            <input type="text" className="form-control" name="idade" onChange={handleChange}/>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => pedidoPost()}>Incluir</button>
          <button className="btn btn-danger" onClick={() => abrirFecharModalIncluir()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEditar}>
        <ModalHeader>Editar Aluno</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>ID:</label>
            <input type="text" className="form-control" readOnly value={alunoSelecionado && alunoSelecionado.id}/>
            <br/>
            <label>Nome:</label>
            <br/>
            <input type="text" className="form-control" name="nome" onChange={handleChange}
                  value={alunoSelecionado && alunoSelecionado.nome}/>
            <label>Email:</label>
            <br/>
            <input type="text" className="form-control" name="email" onChange={handleChange}
                  value={alunoSelecionado && alunoSelecionado.email}/>
            <label>Idade:</label>
            <br/>
            <input type="text" className="form-control" name="idade" onChange={handleChange}
                  value={alunoSelecionado && alunoSelecionado.idade}/>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => pedidoPut()}>Editar</button>
          <button className="btn btn-danger" onClick={() => abrirFecharModalEditar()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalDeletar}>
        <ModalBody>
            Confirma a exclusão deste(a) aluno(a)?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => pedidoDelete()}>Sim</button>
          <button className="btn btn-secondary" onClick={() => abrirFecharModalDeletar()}>Não</button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;