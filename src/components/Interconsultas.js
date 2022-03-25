/* eslint eqeqeq: "off" */
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import moment from 'moment';
import deletar from '../images/deletar.svg';
import salvar from '../images/salvar.svg';
import Toast from './Toast';
import { useHistory } from "react-router-dom";
import Context from '../Context';

function Interconsultas(
  { viewinterconsulta,
    hospital,
    unidade,
    idinterconsulta,
    especialidade,
    motivo,
    parecer,
    datainicio,
    datatermino,
    idsolicitante,
    idatendente,
    status,
  }) {

  const {
    idunidade,
    setlistinterconsultas,
    setarrayinterconsultas,
    idpaciente, idatendimento,
  } = useContext(Context)

  // chave para exibição do componente.
  const [viewcomponent, setviewcomponent] = useState(viewinterconsulta);

  useEffect(() => {
    if (viewinterconsulta !== 0) {
      setviewcomponent(viewinterconsulta);
      if (viewinterconsulta === 1) {
        setselectedespecialidade('SELECIONE UMA ESPECIALIDADE');
      } else {
        setselectedespecialidade(especialidade);
      }
    } else {
    }
  }, [viewinterconsulta])

  let arrayespecialidades = [
    'ANESTESIOLOGIA',
    'CARDIOLOGIA',
    'CIRURGIA GERAL',
    'CIRURGIA TORÁCICA',
    'GERIATRIA'];

  // tela para seleção da especialidade.
  const [showespecialidades, setshowespecialidades] = useState(0);
  function ShowEspecialidades() {
    if (showespecialidades === 1) {
      return (
        <div
          className="menucover"
          onClick={() => setshowespecialidades(0)}
          style={{
            zIndex: 9,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <div className="menucontainer" style={{ padding: 30 }}>
            <div className="scroll"
              id="LISTA DE ESPECIALIDADES"
              style={{
                padding: 0, paddingRight: 5,
                height: 0.4 * window.innerHeight,
              }}
            >
              <div style={{ width: '100%' }}>
                {arrayespecialidades.map((item) => (
                  <button
                    className="blue-button"
                    style={{
                      width: 0.3 * window.innerWidth,
                      margin: 10,
                    }}
                    onClick={(e) => { selectEspecialidade(item); e.stopPropagation() }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  // selecionando uma especialidade.
  const [selectedespecialidade, setselectedespecialidade] = useState();
  const selectEspecialidade = (value) => {
    setselectedespecialidade(value);
    setshowespecialidades(0);
  }

  var htmlghapinterconsultas = process.env.REACT_APP_API_CLONE_INTERCONSULTAS;
  const loadInterconsultas = () => {
    axios.get(htmlghapinterconsultas + idatendimento).then((response) => {
      var x = [0, 1];
      var y = [0, 1];
      x = response.data;
      y = x.rows;
      setlistinterconsultas(y.sort((a, b) => moment(a.datainicio, 'DD/MM/YYYY HH:MM') < moment(b.datainicio, 'DD/MM/YYYY HH:MM') ? 1 : -1).filter(item => item.idatendimento == idatendimento));
      setarrayinterconsultas(y.sort((a, b) => moment(a.datainicio, 'DD/MM/YYYY HH:MM') < moment(b.datainicio, 'DD/MM/YYYY HH:MM') ? 1 : -1).filter(item => item.idatendimento == idatendimento));
    });
  }

  // inserindo registro.
  var htmlghapinsertinterconsulta = process.env.REACT_APP_API_CLONE_INSERTINTERCONSULTA;
  const insertData = () => {
    var motivo = document.getElementById("inputMotivo").value.toUpperCase();
    // alert(selectedespecialidade)
    if (motivo != '' && selectedespecialidade != 'SELECIONE UMA ESPECIALIDADE') {
      var obj = {
        idpct: idpaciente,
        idatendimento: idatendimento,
        especialidade: selectedespecialidade,
        motivo: motivo,
        parecer: null,
        datainicio: moment(),
        datatermino: null,
        idsolicitante: 0,
        idatendente: null,
        status: 0, // 0 = registrada, 1 = assinada, 2 = respondida, 3 = suspensa.
        unidade: idunidade,
      };
      axios.post(htmlghapinsertinterconsulta, obj).then(() => {
        toast(1, '#52be80', 'INTERCONSULTA REGISTRADA COM SUCESSO.', 3000);
        loadInterconsultas();
        fechar();
      });

    } else {
      toast(1, '#ec7063', 'CAMPOS OBRIGATÓRIOS EM BRANCO.', 5000);
    }
  };

  // atualizando registro.
  var htmlghapupdateinterconsulta = process.env.REACT_APP_API_CLONE_UPDATEINTERCONSULTA;
  const updateData = () => {
    var motivo = document.getElementById("inputMotivo").value.toUpperCase();
    if (motivo !== '' && selectedespecialidade !== '') {
      var obj = {
        idpct: idpaciente,
        idatendimento: idatendimento,
        especialidade: selectedespecialidade,
        motivo: motivo,
        parecer: null,
        datainicio: moment(),
        datatermino: null,
        idsolicitante: 0,
        idatendente: null,
        status: 0, // 0 = registrada, 1 = assinada, 2 = respondida, 3 = suspensa.
        unidade: idunidade,
      };
      axios.post(htmlghapupdateinterconsulta + idinterconsulta, obj).then(() => {
        toast(1, '#52be80', 'INTERCONSULTA ATUALIZADA COM SUCESSO.', 3000);
        loadInterconsultas();
        fechar();
      });
    } else {
      toast(1, '#ec7063', 'CAMPOS OBRIGATÓRIOS EM BRANCO.', 5000);
    }
  };

  // função para construção dos toasts.
  const [valortoast, setvalortoast] = useState(0);
  const [cor, setcor] = useState('transparent');
  const [mensagem, setmensagem] = useState('');
  const [tempo, settempo] = useState(2000);
  const toast = (value, color, message, time) => {
    setvalortoast(value);
    setcor(color);
    setmensagem(message);
    settempo(time);
    setTimeout(() => {
      setvalortoast(0);
    }, time + 1000);
  }

  const fechar = () => {
    setviewcomponent(0);
    window.scrollTo(0, 0);
    document.body.style.overflow = null;
  }

  // renderização do componente.
  if (viewcomponent !== 0) {
    return (
      <div className="menucover" style={{ zIndex: 9, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <ShowEspecialidades></ShowEspecialidades>
        <Toast valortoast={valortoast} cor={cor} mensagem={mensagem} tempo={tempo} />
        <div className="menucontainer">
          <div id="cabeçalho" className="cabecalho">
            <div className="title5">{viewcomponent == 1 ? 'INSERIR INTERCONSULTA' : 'EDITAR INTERCOSULTA'}</div>
            <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <button className="red-button" onClick={() => setviewcomponent(0)}>
                <img
                  alt=""
                  src={deletar}
                  style={{
                    margin: 10,
                    height: 30,
                    width: 30,
                  }}
                ></img>
              </button>
              <button className="green-button"
                onClick={viewcomponent == 1 ? () => insertData() : () => updateData()}
              >
                <img
                  alt=""
                  src={salvar}
                  style={{
                    margin: 10,
                    height: 30,
                    width: 30,
                  }}
                ></img>
              </button>
            </div>
          </div>
          <div
            className="corpo"
          >
            <button
              className="blue-button"
              style={{
                width: '100%',
                padding: 10,
              }}
              onClick={() => setshowespecialidades(1)}
            >
              {selectedespecialidade}
            </button>
            <label className="title2" style={{ marginTop: 15, fontSize: 14 }}>
              MOTIVO:
            </label>
            <textarea
              autoComplete="off"
              className="textarea"
              placeholder="MOTIVO."
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = 'MOTIVO.')}
              title="MOTIVO DA INTERCONSULTA."
              style={{
                width: 0.4 * window.innerWidth,
                minWidth: 400,
                minHeight: 125,
              }}
              type="text"
              maxLength={200}
              id="inputMotivo"
              defaultValue={viewcomponent == 2 ? motivo : ''}
            />
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
}
export default Interconsultas;