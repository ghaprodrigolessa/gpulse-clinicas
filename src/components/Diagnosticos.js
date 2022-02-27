/* eslint eqeqeq: "off" */
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import deletar from '../images/deletar.svg';
import save from '../images/salvar.svg';
import Toast from './Toast';
import { useHistory } from "react-router-dom";
import DatePicker from '../components/DatePicker';
import Context from '../Context';
import moment from 'moment';

function Diagnostico(
  {
    usuario,
    viewdiagnostico,
    iddiagnostico,
    iniciodiag,
    terminodiag,
    cid,
    diagnostico,
  }) {
  //servidor.
  var html = 'https://pulsarapp-server.herokuapp.com';
  // api para CID10:
  var cid10 = 'https://cid10-api.herokuapp.com/cid10';
  // recuperando estados globais (Context.API).
  const {
    idatendimento,
    idpaciente,
    setpickdate1,
    pickdate1,
    setpickdate2,
    pickdate2,
    setlistdiagnosticos,
    setarraydiagnosticos,
  } = useContext(Context)
  // history (react-router-dom).
  let history = useHistory()

  // chave para exibição do componente.
  const [viewcomponent, setviewcomponent] = useState(viewdiagnostico);

  // filtros para cid e diagnósticos.
  const [filtercid, setfiltercid] = useState('');
  const [filterdiagnostico, setfilterdiagnostico] = useState('');
  var searchcid = '';
  var searchdiagnostico = '';
  var timeout = null;
  const [arraydiagnostico, setarraydiagnostico] = useState([]);
  const filterDiagnostico = () => {
    setvalordatepicker(0);
    clearTimeout(timeout);
    document.getElementById("inputDiagnostico").focus();
    searchdiagnostico = document.getElementById("inputDiagnostico").value.toUpperCase();
    timeout = setTimeout(() => {
      if (searchdiagnostico === '') {
        setarraylistcid([]);
        document.getElementById("inputDiagnostico").value = '';
        document.getElementById("inputDiagnostico").focus();
      } else {
        setfilterdiagnostico(document.getElementById("inputDiagnostico").value.toUpperCase());
        setarraylistcid(listcid.filter(item => item.descricao.toUpperCase().includes(searchdiagnostico) === true || item.cid.toUpperCase().includes(searchdiagnostico) === true));
        document.getElementById("inputDiagnostico").value = searchdiagnostico;
        document.getElementById("inputDiagnostico").focus();
      }
    }, 500);
  }

  useEffect(() => {
    if (viewdiagnostico !== 0) {
      setvalordatepicker(0);
      // carregando a lista de diagnósticos do sistema.
      getListaDeDiagnosticos();
      setviewcomponent(viewdiagnostico);
      if (viewdiagnostico == 1) {
        setpickdate1(moment().format('DD/MM/YYYY'));
        setpickdate2('');
      } else {
        setpickdate1(moment(iniciodiag).format('DD/MM/YYYY'));
        setpickdate2(moment(terminodiag).format('DD/MM/YYYY'));
      }
    } else {
    }
  }, [viewdiagnostico])

  var htmlghapcid = process.env.REACT_APP_API_CLONE_CID;
  var htmlghapinsertdiagnostico = process.env.REACT_APP_API_CLONE_INSERTDIAGNOSTICO;
  var htmlghapupdatediagnostico = process.env.REACT_APP_API_CLONE_UPDATEDIAGNOSTICO;
  var htmlghapdiagnosticos = process.env.REACT_APP_API_CLONE_DIAGNOSTICOS;
  // cid10.
  const [listcid, setlistcid] = useState([]);
  const [arraylistcid, setarraylistcid] = useState([]);
  const getListaDeDiagnosticos = () => {
    axios.get(htmlghapcid).then((response) => {
      var x = [0, 1];
      x = response.data;
      setlistcid(x.rows);
      setarraylistcid(x.rows);
      // alert(listacid.length)
    });
  }
  // lista de diagnósticos para o atendimento.
  const getDiagnosticosGhap = () => {
    axios.get(htmlghapdiagnosticos + idatendimento).then((response) => {
      var x = [];
      x = response.data;
      setlistdiagnosticos(x.rows);
      setarraydiagnosticos(x.rows);
    });
  }
  // inserir diagnóstico.
  const insertData = (item) => {
    var obj = {
      idpct: idpaciente,
      idatendimento: idatendimento,
      datainicio: moment(pickdate1, 'DD/MM/YYYY'),
      datatermino: null,
      idprofissional: 0,
      cid: item.cid,
      descricao: item.descricao,
    }
    axios.post(htmlghapinsertdiagnostico, obj).then(() => {
      toast(1, '#52be80', 'DIAGNÓSTICO REGISTRADO COM SUCESSO.', 3000);
      setTimeout(() => {
        getDiagnosticosGhap();
        fechar();
      }, 3000);
    });
  }

  // atualizando registro (inativação do registro).
  const updateData = () => {
    var cid = document.getElementById("inputCid").value.toUpperCase();
    var descricao = document.getElementById("inputDiagnostico").value.toUpperCase();
    var inicio = moment(document.getElementById("inputInicio"), 'DD/MM/YYYY');
    if (inicio != '' && cid != '' && descricao != '') {
      var obj = {
        idpct: idpaciente,
        idatendimento: idatendimento,
        datainicio: inicio,
        datatermino: terminodiag,
        idprofissional: 0,
        cid: cid,
        descricao: descricao,
      }
      axios.post(htmlghapupdatediagnostico + iddiagnostico, obj).then(() => {
        toast(1, '#52be80', 'DIAGNÓSTICO ATUALIZADO COM SUCESSO.', 3000);
        setTimeout(() => {
          getDiagnosticosGhap();
          fechar();
        }, 3000);
      });
    } else {
      toast(1, '#ec7063', 'CAMPOS OBRIGATÓRIOS EM BRANCO.', 6000);
    }
  };

  // exibição do datepicker.
  const [valordatepicker, setvalordatepicker] = useState(0);
  const [mododatepicker, setmododatepicker] = useState(0);
  const showDatePicker = (value, mode) => {
    setvalordatepicker(0);
    setTimeout(() => {
      setvalordatepicker(value);
      setmododatepicker(mode);
    }, 500);
  }

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
    }, time);
  }

  const [selectcid, setselectcid] = useState(0);
  const [selectdescricao, setselectdescricao] = useState('');
  const selectDiagnostico = (item) => {
    insertData(item);
  }

  const fechar = () => {
    setviewcomponent(0);
    window.scrollTo(0, 0);
    document.body.style.overflow = null;
  }

  // renderização do componente.
  if (viewcomponent !== 0) {
    return (
      <div className="menucover fade-in" style={{ zIndex: 9 }}>
        <DatePicker valordatepicker={valordatepicker} mododatepicker={mododatepicker} />
        <Toast valortoast={valortoast} cor={cor} mensagem={mensagem} tempo={tempo} />
        <div className="menucontainer">
          <div id="cabeçalho" className="cabecalho">
            <div>{viewcomponent == 1 ? 'INSERIR DIAGNÓSTICO' : 'EDITAR DIAGNÓSTICO'}</div>
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
            </div>
          </div>
          <div className="corpo">
            <div id="FILTROS DE DIAGNÓSTICOS"
              style={{
                display: 'flex', flexDirection: window.innerWidth > 400 ? 'row' : 'column',
                justifyContent: 'center', width: '100%',
                alignItems: 'center',
              }}>
              <div id="divInicio" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: window.innerWidth > 400 ? '20vw' : '90vw', alignSelf: 'center' }}>
                <label className="title2">
                  DATA DO DIAGNÓSTICO:
                </label>
                <label
                  autoComplete="off"
                  className="input"
                  placeholder="INÍCIO"
                  onFocus={(e) => (e.target.placeholder = '')}
                  onBlur={(e) => (e.target.placeholder = 'INÍCIO')}
                  title="DATA DO DIAGNÓSTICO."
                  onClick={() => showDatePicker(1, 1)}
                  defaultValue={viewcomponent == 2 ? moment(iniciodiag).format('DD/MM/YYYY') : moment().format('DD/MM/YYYY')}
                  type="text"
                  maxLength={5}
                  id="inputInicio"
                >
                  {pickdate1}
                </label>
              </div>
              <div id="divDiagnostico" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: window.innerWidth > 400 ? '30vw' : '90vw', alignSelf: 'center' }}>
                <label className="title2">
                  BUSCAR DIAGNÓSTICO:
                </label>
                <input
                  autoComplete="off"
                  className="input"
                  placeholder="BUSCAR..."
                  onFocus={(e) => {
                    (e.target.placeholder = '');
                  }}
                  onBlur={(e) => (e.target.placeholder = 'BUSCAR...')}
                  onChange={() => filterDiagnostico()}
                  title="BUSCAR CID."
                  type="text"
                  maxLength={200}
                  id="inputDiagnostico"
                ></input>
              </div>
            </div>
            <div
              className="scroll"
              id="LISTA DE DIAGNÓSTICOS"
              style={{ width: '60vw', maxWidth: '60vw', minWidth: '60vw', height: '30vh', marginTop: 20 }}
            >
              {arraylistcid.map((item) => (
                <p
                  key={item.id}
                  id="item da lista"
                  className="row"
                  onClick={() => selectDiagnostico(item)}
                >
                  <button
                    className={item.cid == selectcid ? "red-button" : "blue-button"}
                    style={{
                      display: window.innerWidth > 800 ? 'flex' : 'none',
                      width: 100,
                      margin: 2.5,
                      flexDirection: 'column',
                    }}
                  >
                    <div>{item.cid}</div>
                  </button>
                  <button
                    className={item.cid == selectcid ? "red-button" : "hover-button"}
                    style={{
                      width: window.innerWidth > 800 ? '100%' : '100%',
                      margin: 2.5,
                      padding: 5,
                      flexDirection: 'column',
                    }}
                  >
                    <div>{item.descricao.toUpperCase()}</div>
                  </button>
                </p>
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

export default Diagnostico;
