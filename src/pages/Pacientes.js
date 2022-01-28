/* eslint eqeqeq: "off" */
import React, { useState, useContext } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import call from '../images/call.svg';
import moment from 'moment';
import Header from '../components/Header';
import Context from '../Context';
import { useHistory } from "react-router-dom";
import useInterval from 'react-useinterval';

// leitor de qr code.
import QrReader from 'react-qr-reader';

// componentes do Paulo de Tarso (APT).
import AptPlanoTerapeutico from '../components/AptPlanoTerapeutico';

function Pacientes() {
  var html = 'https://pulsarapp-server.herokuapp.com';
  var htmlleitos = process.env.REACT_APP_API_LEITOS;
  var htmlatendimentos = process.env.REACT_APP_API_ATENDIMENTOS;
  var htmlpacientes = process.env.REACT_APP_API_FILTRAPACIENTES;
  // recuperando estados globais (Context.API).
  const {
    idusuario,
    nomeusuario,
    tipousuario,
    especialidadeusuario,
    idhospital,
    nomehospital,
    idunidade,
    nomeunidade,
    tipounidade,
    setidpaciente,
    setconvenio,
    idpaciente,
    idatendimento,
    setidatendimento,
    setdadospaciente,
    setdatainternacao,
    dadospaciente,
    todosleitos,
    settodospacientes, todospacientes,
    settodosatendimentos, todosatendimentos,
  } = useContext(Context)
  // history (react-router-dom).
  let history = useHistory()

  // renderização do leitor de qr.
  const [recebepct, setrecebepct] = useState(0);
  // const [qrscan, setqrscan] = useState('LOUCURA');

  // console.log('DATA: ' + qrscan);

  const handleScan = (result) => {
    console.log('LENDO...')
    if (result) {
      // setqrscan(result)
      // console.log('FUNFOU')
      // console.log('DATA: ' + qrscan);
      // lógica para atualizar registro de atendimento com a localização atual.
      var x = [];
      // x = atendimentos.filter((item) => item.ativo != 0 && item.idpaciente == qrscan).slice(-1);
      // console.log(x);
      setTimeout(() => {
        updateAtendimento(x, result);
      }, 2000);
      setrecebepct(0);
    }
  }
  const handleError = err => {
    console.log('ERRO: ' + err)
  }

  // carregando regitro de atendimentos.
  var htmlatendimentos = process.env.REACT_APP_API_ATENDIMENTOS;
  const loadAtendimentos = () => {
    axios.get(htmlatendimentos).then((response) => {
      var x = [0, 1]
      x = response.data;
      settodosatendimentos(x);
      setarrayatendimentos(x);
      // alert('ATENDIMENTOS:' + x.length);
    })
  }
  // atualizando resgistro de atendimentos.
  useInterval(() => {
    console.log('ATUALIZANDO ATENDIMENTOS EM PACIENTES.');
    loadAtendimentos();
  }, 60000);

  // função que atualiza o atendimento do paciente recebido na unidade.
  const updateAtendimento = (x, result) => {
    var obj = {
      idpaciente: x.idpaciente,
      radar: nomeunidade,
      hospital: x.hospital,
      unidade: x.unidade,
      box: x.box,
      admissao: x.admissao,
      nome: x.nome,
      dn: x.dn,
      peso: x.peso,
      altura: x.altura,
      antecedentes: x.antecedentes,
      alergias: x.alergias,
      medicacoes: x.medicacoes,
      exames: x.exames,
      historia: x.historia,
      status: x.status,
      ativo: x.ativo,
      classificacao: x.classificacao,
      descritor: x.descritor,
      precaucao: x.precaucao,
      assistente: x.assistente,
    };
    axios.post(html + '/updateatendimento/' + result, obj).then(() => {
    });
  };

  const QRScanner = () => {
    return (
      <div style={{ display: window.innerWidth < 1024 ? 'flex' : 'none' }}>
        <button style={{
          display: recebepct == 0 ? 'flex' : 'none',
          margin: 20,
          padding: 10,
          // position: 'absolute', top: 20, left: 20, right: 20, padding: 10
        }}
          className="blue-button"
          onClick={() => setrecebepct(1)}
        >
          RECEBER PACIENTE
        </button>
        <div style={{ display: recebepct == 1 ? 'flex' : 'none', borderColor: 'red', borderRadius: 5 }}>
          <QrReader
            // delay={1000}
            // onError={handleError}
            // onScan={handleScan}
            style={{
              height: '90vw', width: '90vw', borderRadius: 5, margin: 20,
              // position: 'absolute', top: 20, left: 20, right: 20
            }}

          />
        </div>
      </div>
    )
  }

  // carregamento do número de leitos do cti selecionado.
  const [leitos, setleitos] = useState(10);
  const loadLeitos = () => {
    // ROTA: SELECT * FROM hospitaisxunidades WHERE hospital = hospital AND unidade = unidade.
    axios.get(htmlleitos).then((response) => {
      var x = [0, 1];
      x = response.data;
      const arrayLeitos = x.map((item) => item.descricao);
      setleitos(arrayLeitos[0]);
    });
  }

  // lista de pacientes.
  const [listpacientes, setlistpacientes] = useState([]);
  const [arraypacientes, setarraypacientes] = useState([]);
  const loadPacientes = () => {
    axios.get(html + "/pacientes").then((response) => {
      var x = [0, 1];
      x = response.data;
      setlistpacientes(x);
      setarraypacientes(x);
    });
  }

  // lista de atendimentos (demais unidades de internação como enfermarias, ctis, etc.).
  const [atendimentos, setatendimentos] = useState(todosatendimentos);
  const [arrayatendimentos, setarrayatendimentos] = useState(todosatendimentos);
  // lista de chamadas.
  const [listcalls, setlistcalls] = useState([]);
  const loadCalls = () => {
    axios.get(html + "/calls").then((response) => {
      var x = [0, 1];
      x = response.data;
      setlistcalls(response.data);
      // executando a chamada de voz quando temos mais de 4 registros de chamadas.
      if (x.filter(item => item.hospital == nomehospital && item.unidade == nomeunidade).length > 4) {
        makeVoice(x.map(item => item.paciente).pop());
        setTimeout(() => {
          /* excluindo a primeira call da lista de chamadas (necessário para manter a lista
          limpa e impedir o disparo da voz anunciando o nome do paciente). */
          deleteCall(x);
        }, 3000);
      }
    });
  }

  // chamada por voz do paciente.
  const makeVoice = (nome) => {
    var msg = new SpeechSynthesisUtterance();
    msg.volume = 1; // From 0 to 1
    msg.rate = 0.7; // From 0.1 to 10
    msg.pitch = 0.7; // From 0 to 2
    msg.text = nome;
    msg.lang = 'pt-br';
    window.speechSynthesis.speak(msg);
  }

  // cabeçalho da lista de pacientes (unidades de internação).
  function CabecalhoInternacao() {
    return (
      <div
        className="scrollheader"
        id="CABEÇALHO DA LISTA DE PACIENTES INTERNADOS"
      >
        <div className="rowheader">
          <button
            className="header-button"
            style={{ backgroundColor: 'transparent' }}
            title="BOX"
            disabled="true"
          >
            BOX
          </button>
          <button
            className="header-button"
            style={{ backgroundColor: 'transparent' }}
            title="BOX"
            disabled="true"
          >

          </button>
          <button
            className="header-button"
            style={{
              width: '100%',
            }}
          >
            NOME
          </button>
          <button
            className="header-button"
            style={{ backgroundColor: 'transparent', width: 150 }}
            title="BOX"
            disabled="true"
          >
            MIF
          </button>
          <div
            className="rowitemheader"
            style={{
              display: window.innerWidth < 400 ? 'none' : 'flex',
              width: '20%',
            }}
          >
            IDADE
          </div>
          <div
            className="rowitemheader"
            style={{
              display: window.innerWidth < 400 ? 'none' : 'flex',
              width: '30%',
            }}
          >
            TEMPO DE INTERNAÇÃO
          </div>
          <div
            className="rowitemheader"
            style={{
              display: window.innerWidth < 400 ? 'none' : 'flex',
              width: '30%',
            }}
          >
            MÉDICO ASSISTENTE
          </div>
        </div>
      </div>
    )
  }

  // cabeçalho da lista de pacientes (unidades de internação).
  const [arrayatendimentosclassified, setarrayatendimentosclassified] = useState([]);
  const [classificabox, setclassificabox] = useState(1);
  const [classificanome, setclassificanome] = useState(0);
  const [classificamif, setclassificamif] = useState(0);
  const [classificaidade, setclassificaidade] = useState(0);
  const [classificatempointernacao, setclassificatempointernacao] = useState(0);
  const [classificaassistente, setclassificaassistente] = useState(0);

  function CabecalhoInternacao() {
    return (
      <div
        className="scrollheader"
        id="CABEÇALHO DA LISTA DE PACIENTES INTERNADOS"
      >
        <div className="rowheader">
          <button
            onClick={() => {
              // setclassificabox(0);
              setclassificanome(0);
              setclassificamif(0);
              setclassificaidade(0);
              setclassificatempointernacao(0);
              setclassificaassistente(0);
              if (classificabox == 0 || classificabox == 2) {
                setclassificabox(1)
                setarrayatendimentosclassified(arrayatendimentos.sort(((a, b) => a.Leito.descricao > b.Leito.descricao ? 1 : -1)));
              } else if (classificabox == 1) {
                setclassificabox(2)
                setarrayatendimentosclassified(arrayatendimentos.sort(((a, b) => a.Leito.descricao < b.Leito.descricao ? 1 : -1)));
              }
            }}
            className="header-button"
            style={{ backgroundColor: 'transparent', color: classificabox == 0 ? '' : 'red', minWidth: 100 }}
            title="LEITO"
          >
            {classificabox == 0 ? 'LEITO' : classificabox == 1 ? 'LEITO ↓' : 'LEITO ↑'}
          </button>
          <button
            className="header-button"
            style={{ backgroundColor: 'transparent' }}
            title="LEITO"
          >

          </button>
          <button
            onClick={() => {
              setclassificabox(0);
              // setclassificanome(0);
              setclassificamif(0);
              setclassificaidade(0);
              setclassificatempointernacao(0);
              setclassificaassistente(0);
              if (classificanome == 0 || classificanome == 2) {
                setclassificanome(1)
                setarrayatendimentosclassified(arrayatendimentos.sort(((a, b) => a.nm_paciente > b.nm_paciente ? 1 : -1)));
              } else if (classificanome == 1) {
                setclassificanome(2)
                arrayatendimentos.sort(((a, b) => a.nome < b.nome ? 1 : -1))
                setarrayatendimentosclassified(arrayatendimentos.sort(((a, b) => a.nm_paciente < b.nm_paciente ? 1 : -1)));
              }
            }}
            className="header-button"
            style={{
              width: '100%',
              color: classificanome == 0 ? '' : 'red'
            }}
          >
            {classificanome == 0 ? 'NOME' : classificanome == 1 ? 'NOME ↓' : 'NOME ↑'}
          </button>
          <button
            onClick={() => {
              setclassificabox(0);
              setclassificanome(0);
              // setclassificamif(0);
              setclassificaidade(0);
              setclassificatempointernacao(0);
              setclassificaassistente(0);
              if (classificamif == 0 || classificamif == 2) {
                setclassificamif(1);
                setarrayatendimentosclassified(arrayatendimentos.sort(((a, b) => a.mif < b.mif ? 1 : -1)));
              } else if (classificamif == 1) {
                setclassificamif(2);
                setarrayatendimentosclassified(arrayatendimentos.sort(((a, b) => a.mif > b.mif ? 1 : -1)));
              }
            }}
            className="header-button"
            style={{
              display: window.innerWidth < 400 ? 'none' : 'flex',
              backgroundColor: 'transparent', width: 150, color: classificamif == 0 ? '' : 'red'
            }}
            title="MIF"
          >
            {classificamif == 0 ? 'MIF' : classificamif == 1 ? 'MIF ↓' : 'MIF ↑'}
          </button>
          <div
            className="rowitemheader"
            style={{
              display: window.innerWidth < 400 ? 'none' : 'flex',
              width: '20%',
              color: classificaidade == 0 ? '' : 'red'
            }}
          >
            {classificaidade == 0 ? 'IDADE' : classificaidade == 1 ? 'IDADE ↓' : 'IDADE ↑'}
          </div>
          <div
            onClick={() => {
              setclassificabox(0);
              setclassificanome(0);
              setclassificamif(0);
              setclassificaidade(0);
              // setclassificatempointernacao(0);
              setclassificaassistente(0);
              if (classificatempointernacao == 0 || classificatempointernacao == 2) {
                setclassificatempointernacao(1)
                setarrayatendimentosclassified(arrayatendimentos.sort(((a, b) => moment().diff(moment(a.dt_hr_atendimento, 'YYYY/MM/DD'), 'days') > moment().diff(moment(b.dt_hr_atendimento, 'YYYY/MM/DD'), 'days') ? 1 : -1)));
              } else if (classificatempointernacao == 1) {
                setclassificatempointernacao(2)
                setarrayatendimentosclassified(arrayatendimentos.sort(((a, b) => moment().diff(moment(a.dt_hr_atendimento, 'YYYY/MM/DD'), 'days') < moment().diff(moment(b.dt_hr_atendimento, 'YYYY/MM/DD'), 'days') ? 1 : -1)));
              }
            }}
            className="rowitemheader"
            style={{
              display: window.innerWidth < 400 ? 'none' : 'flex',
              width: '30%',
              color: classificatempointernacao == 0 ? '' : 'red'
            }}
          >
            {classificatempointernacao == 0 ? 'TEMPO DE INTERNAÇÃO' : classificabox == 1 ? 'TEMPO DE INTERNAÇÃO ↓' : 'TEMPO DE INTERNAÇÃO ↑'}
          </div>
          <div
            onClick={() => {
              setclassificabox(0);
              setclassificanome(0);
              setclassificamif(0);
              setclassificaidade(0);
              setclassificatempointernacao(0);
              setclassificaassistente(0);
              if (classificaassistente == 0 || classificaassistente == 2) {
                setclassificaassistente(1)
                setarrayatendimentosclassified(arrayatendimentos.sort(((a, b) => a.nm_prestador > b.nm_prestador ? 1 : -1)));
              } else if (classificaassistente == 1) {
                setclassificaassistente(2)
                setarrayatendimentosclassified(arrayatendimentos.sort(((a, b) => a.nm_prestador > b.nm_prestador ? 1 : -1)));
              }
            }}
            className="rowitemheader"
            style={{
              display: window.innerWidth < 400 ? 'none' : 'flex',
              width: '30%',
              color: classificaassistente == 0 ? '' : 'red'
            }}
          >
            {classificaassistente == 0 ? 'MÉDICO ASSISTENTE' : classificaassistente == 1 ? 'MÉDICO ASSISTENTE ↓' : 'MÉDICO ASSISTENTE ↑'}
          </div>
        </div>
      </div>
    )
  }

  // renderização da lista de pacientes.
  function ShowPacientes() {
    if (arrayatendimentos.filter(item => item.Leito.unidade.id == idunidade).length > 0) {
      return (
        <div
          id="LISTA DE PACIENTES"
          className="scroll"
          style={{ height: '100%' }}
        >
          {arrayatendimentos.filter(item => item.Leito.unidade.id == idunidade).map((item) => (
            <div style={{
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              width: window.innerWidth > 400 ? '' : '90vw'
            }}>
              <div
                key={item.id}
                className="row"
                style={{
                  width: window.innerWidth > 400 ? '' : '85vw',
                  position: 'relative',
                  justifyContent: 'space-between',
                  // display: arraypacientes.filter((value) => value.id === item.idpaciente).length > 0 ? 'flex' : 'none',
                }}
              >
                <button
                  className="grey-button"
                  style={{ minWidth: 100, margin: 2.5, color: '#ffffff', backgroundColor: 'grey' }}
                  title="LEITO"
                  disabled="true"
                >
                  {item.Leito.descricao}
                </button>
                <button
                  className="grey-button"
                  style={{
                    minWidth: 50, margin: 2.5, color: '#ffffff',
                    backgroundColor: item.precaucao == 1 ? "#8f9bbc" : item.precaucao == 2 ? "#f5b041" : item.precaucao == 3 ? "#bb8fce" : "#ec7063"
                  }}
                  title={item.precaucao == 1 ? 'PRECAUÇÃO PADRÃO' : item.precaucao == 2 ? 'PRECAUÇÃO DE CONTATO' : item.precaucao == 3 ? 'PRECAUÇÃO PARA GOTÍCULAS' : 'PRECAUÇÃO PARA AEROSSÓIS'}
                  disabled="true"
                >
                  {'A'}
                </button>
                <button
                  onClick={() => selectPaciente(item)}
                  className="blue-button"
                  title={
                    'STATUS: ' +
                      item.linhadecuidado == 1 ? "PACIENTE CRÔNICO. CLIQUE PARA EVOLUIR." : item.linhadecuidado == 2 ? "PACIENTE EM CUIDADOS PALIATIVOS. CLIQUE PARA EVOLUIR." : item.status == 3 ? "PACIENTE EM REABILITAÇÃO. CLIQUE PARA EVOLUIR." : item.status == 4 ? "CONFORTO. CLIQUE PARA EVOLUIR." : "STATUS NÃO DEFINIDO. CLIQUE PARA EVOLUIR."
                  }
                  style={{
                    width: '100%',
                    padding: 5, paddingLeft: 10,
                    justifyContent: 'space-between',
                    backgroundColor: item.linhadecuidado == 1 ? "#52be80" : item.linhadecuidado == 2 ? "#5DADE2" : item.linhadecuidado == 3 ? "#F4D03F" : "grey"
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', textAlign: 'left' }}>
                    {item.nm_paciente}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <button
                      className="red-button"
                      style={{ display: window.innerWidth < 400 ? 'none' : 'flex', minWidth: 30, width: 30, minHeight: 30, height: 30 }}
                      title="EVOLUÇÃO DO DIA.">
                      E
                    </button>
                    <button
                      className="red-button"
                      style={{ display: window.innerWidth < 400 ? 'none' : 'flex', minWidth: 30, width: 30, minHeight: 30, height: 30 }}
                      title="PRESCRIÇÃO DO DIA.">
                      P
                    </button>
                    <button
                      className="blue-button"
                      style={{ display: window.innerWidth < 400 ? 'none' : 'flex', minWidth: 30, width: 30, minHeight: 30, height: 30 }}
                      title="CLIQUE PARA MAIS CONTROLES."
                      onClick={(e) => { document.getElementById("extras" + item.id).className = "expandpaciente"; e.stopPropagation() }}
                    >
                      +
                    </button>
                  </div>
                </button>
                <buttom className="blue-button" style={{ width: 150, flexDirection: 'column', display: window.innerWidth < 400 ? 'none' : 'flex' }}>
                  <div>10/11/21</div>
                  <div>80%</div>
                </buttom>
                <button
                  className="rowitem"
                  style={{
                    display: window.innerWidth < 400 ? 'none' : 'flex',
                    width: '20%',
                  }}
                >
                  {moment().diff(moment(arrayPacientesEmAtendimento.filter((value) => value.codigo_paciente == item.cd_paciente).map((item) => item.data_nascimento_paciente), 'YYYY/MM/DD'), 'years') > 1 ?
                    moment().diff(moment(arrayPacientesEmAtendimento.filter((value) => value.codigo_paciente == item.cd_paciente).map((item) => item.data_nascimento_paciente), 'YYYY/MM/DD'), 'years') + ' ANOS.' :
                    moment().diff(moment(arrayPacientesEmAtendimento.filter((value) => value.codigo_paciente == item.cd_paciente).map((item) => item.data_nascimento_paciente), 'YYYY/MM/DD'), 'years') + ' ANO.'
                  }
                </button>
                <button
                  className="rowitem"
                  style={{
                    display: window.innerWidth < 400 ? 'none' : 'flex',
                    width: '30%',
                  }}
                >
                  {moment().diff(moment(item.dt_hr_atendimento, 'YYYY/MM/DD'), 'days') + ' DIAS.'}
                </button>
                <button
                  className="rowitem"
                  style={{
                    display: window.innerWidth < 400 ? 'none' : 'flex',
                    width: '30%',
                  }}
                >
                  <div>
                    {JSON.stringify(item.nm_prestador).substring(1, 25).length > 25 ? JSON.stringify(item.nm_prestador).substring(1, 25) + '...' : JSON.stringify(item.nm_prestador).substring(1, 20)}
                  </div>
                </button>
              </div>
              <div id={"extras" + item.id} className="retractpaciente" style={{ position: 'relative', display: window.innerWidth < 400 ? 'none' : 'flex' }}>
                <div id="cardalergias" className="pulsewidgetscroll"
                  onClick={() => document.getElementById("cardalergias").classList.toggle("pulsewidgetscrollmax")}
                  style={{
                    backgroundColor: item.alergias != "" ? '#ec7063' : '#52be80',
                    borderColor: item.alergias != "" ? '#ec7063' : '#52be80',
                    margin: 10, padding: 10,
                  }}
                >
                  <div className="pulsewidgettitle" style={{ color: '#ffffff' }}>ALERGIAS</div>
                  <div className="pulsewidgetcontent" style={{ color: '#ffffff' }}>{'ALERGIAS: ' + item.alergias}</div>
                </div>

                <div
                  className="pulsewidgetstatic"
                  title="PRECAUÇÃO OU ISOLAMENTO DE CONTATO."
                  style={{
                    margin: 10, padding: 10,
                    backgroundColor: item.precaucao == 1 ? "#8f9bbc" : item.precaucao == 2 ? "#f5b041" : item.precaucao == 3 ? "#bb8fce" : "#ec7063"
                  }}
                >
                  <div className="title2center" style={{ color: '#ffffff' }}>
                    {item.precaucao == 1 ? 'PRECAUÇÃO PADRÃO' : item.precaucao == 2 ? 'PRECAUÇÃO DE CONTATO' : item.precaucao == 3 ? 'PRECAUÇÃO PARA GOTÍCULAS' : 'PRECAUÇÃO PARA AEROSSOL'}
                  </div>
                </div>

                <div id={"cardriscos" + item.id} className="pulsewidgetscroll"
                  onClick={() => {
                    // document.getElementById("cardriscos").classList.toggle("pulsewidgetscrollmax");
                    if (document.getElementById("cardriscos" + item.id).className == "pulsewidgetscroll") {
                      document.getElementById("cardriscos" + item.id).className = "pulsewidgetscrollmax"
                      document.getElementById("cardriscos" + item.id).style.width = '30vw'
                    } else {
                      document.getElementById("cardriscos" + item.id).className = "pulsewidgetscroll"
                      document.getElementById("cardriscos" + item.id).style.width = '11vw'
                    }

                  }}
                  style={{
                    backgroundColor: '#f4d03f',
                    borderColor: '#f4d03f',
                    margin: 10, padding: 10,
                  }}
                >
                  <div className="pulsewidgettitle" style={{ color: '#ffffff' }}>GESTÃO DE RISCOS</div>
                  <div
                    className="pulsewidgetcontent">
                    <button className="red-button" style={{ width: '11vw', height: '11vw' }}>
                      {'RISCO DE QUEDA'}
                    </button>
                  </div>
                </div>

                <div className="blue-button"
                  style={{ flexDirection: 'column', margin: 10, padding: 10, width: '11vw', height: '11vw' }}>
                  <div>BARTHEL</div>
                  <div>50</div>
                  <div style={{ fontSize: 10 }}>DEPENDÊNCIA MODERADA</div>
                </div>

                <button
                  className="blue-button" style={{ minWidth: 30, width: 30, minHeight: 30, height: 30, position: 'absolute', right: 5, bottom: 5 }}
                  onClick={() => document.getElementById("extras" + item.id).className = "retractpaciente"}
                >-</button>
              </div>
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div
          className="scroll"
          id="LISTA DE PACIENTES"
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            borderRadius: 5,
            margin: 5,
            height: '100%'
          }}
        >
          <div className="title2"
            style={{
              fontSize: 16,
              opacity: 0.5,
              alignSelf: 'center',
              textAlign: 'center',
            }}>
            {'NÃO HÁ PACIENTES INTERNADOS NESTA UNIDADE.'}
          </div>
        </div>
      )
    }
  }

  // carregamento da lista de pacientes para a unidade selecionada, perfil AMBULATÓRIO.
  const [ambulatorio, setambulatorio] = useState([]);
  const loadAmbulatorio = () => {
    // todos os pacientes agendados para o médico logado.
    axios.get(html + '/consultas').then((response) => {
      var x = [0, 1];
      x = response.data;
      var y = x.filter((item) => item.idassistente === idusuario && item.unidade === nomeunidade && item.ativo !== 0);
      setambulatorio(y);
    });
  }

  // seleção do consultório para atendimento (pronto-socorro):
  const [consultorio, setconsultorio] = useState(0);
  var arrayconsultorios = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [viewconsultorioselector, setviewconsultorioselector] = useState(0);
  function ConsultorioSelector() {
    if (viewconsultorioselector === 1) {
      return (
        <div className="menucover"
          style={{ zIndex: 9, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
          onClick={() => setviewconsultorioselector(0)}
        >
          <div className="menucontainer">
            <label
              className="title2"
              style={{ marginTop: 20, marginBottom: 15, width: 200, textAlign: 'center', justifyContent: 'center' }}
            >
              SELECIONAR CONSULTÓRIO PARA ATENDIMENTO
            </label>
            <div
              className="scroll"
              id="LISTA DE CONSULTÓRIOS"
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                flexWrap: 'wrap',
                height: 250,
                width: 250,
              }}
            >
              {arrayconsultorios.map(item => (
                <div
                  key={item.id}
                  className="blue-button"
                  style={{ width: 50, height: 50 }}
                  onClick={(e) => { defineConsultorio(item); e.stopPropagation() }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  // inserindo registro de chamada para o paciente no pronto-socorro.
  const insertCall = (item) => {
    var obj = {
      data: moment().format('DD/MM/YY HH:mm'),
      idatendimento: item.id,
      paciente: item.nome,
      usuario: nomeusuario,
      especialidade: especialidadeusuario,
      consultorio: consultorio !== 0 ? consultorio : item.consultorio, // emergencia ? ambulatorio.
      hospital: nomehospital,
      unidade: nomeunidade,
    }
    axios.post(html + '/insertcall', obj);
  }

  // excluindo registro de chamada para o paciente no pronto-socorro.
  const deleteCall = (x) => {
    // identificando a id da primeira call.
    axios.get(html + '/deletecall/' +
      x.filter(item => item.hospital == nomehospital && item.unidade == nomeunidade).map(item => item.id)[0]
    );
  }

  // definindo consultório para atendimento.
  const defineConsultorio = (item) => {
    setconsultorio(item);
    setviewconsultorioselector(0);
  }

  // calculando tempo de espera para atendimento.
  const espera = (valor) => {
    var stringadmissao = JSON.stringify(valor).substring(1, 17);
    var minutes = moment().diff(moment(stringadmissao, 'DD/MM/YYYY hh:mm'), 'minutes');
    var dias = Math.floor(minutes / 1440) // total de dias completos esperando.
    var horas = Math.floor(minutes / 60) - (dias * 24) // total horas completas descontando-se as horas dos dias completos.
    var minutos = minutes - (horas * 60) - (dias * 1440) // total de minutos completos descontando-se os dias e horas completos.
    return (dias + ' DIAS, ' + horas + 'H E ' + minutos + 'MIN.')
  }

  // CHART.
  /* gráfico em torta que exibe o total de pacientes internados na unidade, distribuídos
  por linha de cuidado. */
  var leitostotais = [0, 1]
  leitostotais = todosleitos
  var atendimentostotais = [0, 1]
  atendimentostotais = todosatendimentos
  const dataChart = {
    labels: [' OCUPADOS', ' VAGOS'],
    datasets: [
      {
        data: [
          leitostotais.filter(item => item.unidade.id == idunidade).length - atendimentostotais.filter(item => item.Leito.unidade.id == idunidade).length, // vagos.
          atendimentostotais.filter(item => item.Leito.unidade.id == idunidade).length // ocupados.
        ],
        backgroundColor: ['lightgray', '#8f9bbc'],
        borderWidth: 5,
        borderColor: '#f2f2f2',
        hoverBorderColor: ['#f2f2f2', '#f2f2f2'],
      },
    ],
  };

  function Chart() {

    return (
      <div
        id="GRÁFICO"
        className="secondary legenda"
        style={{
          display: 'flex',
          flexDirection: window.innerWidth > 800 ? 'column' : window.innerWidth > 600 ? 'row' : 'column',
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          borderRadius: 5,
          padding: 0,
          margin: window.innerWidth > 400 ? 10 : 5,
          width: '20vw'
        }}
      >
        <div
          id="chart" style={{
            display: renderchart == 1 ? 'flex' : 'none',
            flexDirection: 'column', justifyContent: 'center', alignSelf: 'center',
            position: 'relative'
          }}>
          <Doughnut
            data={dataChart}
            width={window.innerWidth < 400 ? 150 : 0.15 * window.innerWidth}
            height={window.innerWidth < 400 ? 150 : 0.15 * window.innerWidth}
            plugins={ChartDataLabels}
            options={{
              plugins: {
                datalabels: {
                  display: function (context) {
                    return context.dataset.data[context.dataIndex] !== 0;
                  },
                  color: '#FFFFFF',
                  textShadowColor: 'black',
                  textShadowBlur: 5,
                  font: {
                    weight: 'bold',
                    size: 16,
                  },
                },
              },
              tooltips: {
                enabled: false,
              },
              hover: { mode: null },
              elements: {
                arc: {
                  borderColor: '#f2f2f2',
                  borderWidth: 5,
                },
              },
              animation: {
                duration: 0,
              },
              title: {
                display: false,
                text: 'STATUS DOS PACIENTES:',
              },
              legend: {
                display: false,
                position: 'bottom',
              },
              maintainAspectRatio: true,
              responsive: false,
            }}
          ></Doughnut>
          <div>
            <p
              className="title2center"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                fontSize: 20,
                fontWeight: 'bold',
                margin: 2.5,
                padding: 0,
                position: 'absolute',
                top: 0, bottom: 0, left: 0, right: 0,
              }}
            >
              {Math.ceil(
                (atendimentostotais.filter(item => item.Leito.unidade.id == idunidade).length) * 100 /
                leitostotais.filter(item => item.unidade.id == idunidade).length) + '%'}
            </p>
          </div>
        </div>
        <Legenda></Legenda>
      </div>
    );
  }

  // legenda para o gráfico.
  function Legenda() {
    return (
      <div id="LEGENDA"

        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          marginTop: 5,
          marginBottom: 5,
          boxShadow: 'none',
          width: window.innerWidth < 400 ? '60vw' : '100%',
        }}
      >
        <div style={{
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center',
          width: window.innerWidth > 400 ? '' : '30vw'
        }}>
          <div
            id="LEITOS OCUPADOS"
            className="secondary"
            style={{
              width: 20,
              height: 20,
              borderRadius: 5,
              backgroundColor: '#8f9bbc',
              margin: 2.5,
              padding: 0,
            }}
          ></div>
          <p
            className="title2center"
            style={{
              width: '8vw',
              margin: 2.5,
              marginRight: 5,
              padding: 0,
              fontSize: 10,
            }}
          >
            {window.innerWidth > 400 ? 'LEITOS OCUPADOS' : 'OCUPADOS'}
          </p>
        </div>
        <div style={{
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center', alignSelf: 'center',
          width: window.innerWidth > 400 ? '' : '30vw'
        }}>
          <div
            id="LEITOS VAGOS"
            className="secondary"
            style={{
              width: 20,
              height: 20,
              borderRadius: 5,
              backgroundColor: 'lightgray',
              margin: 2.5,
              padding: 0,
            }}
          ></div>
          <p
            className="title2center"
            style={{
              width: '8vw',
              margin: 2.5,
              marginRight: 5,
              padding: 0,
              fontSize: 10,
            }}
          >
            {window.innerWidth > 400 ? 'LEITOS VAGOS' : 'VAGOS'}
          </p>
        </div>
      </div>
    );
  }

  // selecionando um paciente da lista e abrindo a tela corrida.
  const selectPaciente = (item) => {
    setidpaciente(item.cd_paciente)
    setidatendimento(item.cd_atendimento)
    setdatainternacao(item.dt_hr_atendimento);
    setconvenio(item.nm_convenio);
    setdadospaciente(arrayPacientesEmAtendimento.filter(value => value.codigo_paciente == item.cd_paciente));
    history.push('/prontuario');
  };

  const newConsulta = (item) => {
    // extraindo informações do último atendimento do paciente.
    axios.get(html + "/atendimentos").then((response) => {
      var x = [0, 1];
      var y = [0, 1];
      var x = response.data;
      var y = x.filter(value => value.idpaciente == item.idpaciente).slice(-1);
      // criando um novo atendimento ambulatorial.
      var obj = {
        idpaciente: y.map(item => item.idpaciente),
        hospital: nomehospital,
        unidade: nomeunidade,
        box: '',
        admissao: moment().format('DD/MM/YYYY HH:mm'),
        nome: y.map(item => item.nome),
        dn: y.map(item => item.dn),
        peso: '',
        altura: '',
        antecedentes: y.map(item => item.antecedentes),
        alergias: y.map(item => item.alergias),
        medicacoes: y.map(item => item.medicacoes),
        exames: y.map(item => item.exames),
        historia: y.map(item => item.historia),
        status: 4, // cadastrado por padrão como indefinido.
        ativo: 1,
        classificacao: 0,
        descritor: '',
        precaucao: 0,
        assistente: nomeusuario,
      };
      axios.post(html + '/insertatendimento', obj).then(() => {
        // selecionando novamente o último atendimento, referente à consulta recém-criada.
        axios.get(html + "/atendimentos").then((response) => {
          var x = [0, 1];
          var z = [0, 1];
          var x = response.data;
          var z = x.filter(value => value.idpaciente == item.idpaciente).sort(((a, b) => a.id > b.id ? 1 : -1)).slice(-1);
          // abrindo a tela corrida para o paciente selecionado.
          history.push('/prontuario')
        });
      });
    });
  }

  // estado para visualização do totem de chamadas.
  const [viewtoten, setviewtoten] = useState(0);
  const [renderchart, setrenderchart] = useState(0);
  useEffect(() => {
    // carregando a lista de pacientes e de atendimentos.
    MountArrayPacientesEmAtendimento();
    setclassificabox(1)
    setarrayatendimentosclassified(arrayatendimentos.sort(((a, b) => a.Leito.descricao > b.Leito.descricao ? 1 : -1)));
    // loadPacientes();
    loadAmbulatorio();
    setTimeout(() => {
      setrenderchart(1);
    }, 1000);
    if (viewtoten === 1) {
      setInterval(() => {
        loadCalls();
      }, 10000);
    }
    // definindo o modo de exibição da lista de pacientes (INTERNAÇÃO X PRONTO-ATENDIMENTO).
    if (tipounidade === 1) {
      setviewconsultorioselector(1);
    }
    // carregando o total de leitos da unidade.
    loadLeitos();
  }, []);

  function ShowToten() {
    return (
      <div style={{ display: 'flex', width: '100%', flexDirection: 'row', justifyContent: 'flex-end', margin: 10 }}>
        <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-end', marginTop: 5, marginRight: 5, alignSelf: 'flex-end' }}>
          <button
            className="blue-button"
            style={{ display: tipounidade == 1 ? 'flex' : 'none', height: 50, padding: 10, margin: 5, marginBottom: 0 }}
            onClick={() => { setviewconsultorioselector(1) }}
            title="SELECIONAR CONSULTÓRIO"
          >
            {'CONSULTÓRIO: ' + consultorio}
          </button>
          <button
            className="blue-button"
            style={{ display: tipousuario == 2 ? 'flex' : 'none', height: 50, width: 50, padding: 10, margin: 5, marginLeft: 0, marginBottom: 0 }}
            onClick={() => { setviewtoten(1) }}
            title="SELECIONAR CONSULTÓRIO"
          >
            <img alt="" src={call} style={{ height: 30, width: 30 }}></img>
          </button>
        </div>
      </div>
    );
  }

  // filtro de pacientes...
  function FilterPacientes() {
    return (
      <input
        className="input"
        autoComplete="off"
        placeholder="BUSCAR..."
        onFocus={(e) => (e.target.placeholder = '')}
        onBlur={(e) => (e.target.placeholder = 'BUSCAR...')}
        onChange={() => filterPaciente()}
        style={{
          width: '60vw',
          padding: 20,
          margin: 20,
          alignSelf: 'center',
          textAlign: 'center'
        }}
        type="text"
        id="inputFilterPaciente"
        defaultValue={filterpaciente}
        maxLength={100}
      ></input>
    )
  }

  const [filterpaciente, setfilterpaciente] = useState('');
  var searchpaciente = '';
  var searchatendimento = '';
  var timeout = null;

  const filterPaciente = () => {
    clearTimeout(timeout);
    document.getElementById("inputFilterPaciente").focus();
    searchpaciente = document.getElementById("inputFilterPaciente").value.toUpperCase();
    timeout = setTimeout(() => {
      if (searchpaciente == '') {
        setarrayatendimentos(todosatendimentos);
        document.getElementById("inputFilterPaciente").value = '';
        document.getElementById("inputFilterPaciente").focus();
      } else {
        // setarrayatendimentos(document.getElementById("inputFilterPaciente").value.toUpperCase());
        var varatendimentos = [0, 1]
        varatendimentos = todosatendimentos
        var pegapelonome = varatendimentos.filter(item =>
          item.nm_paciente.includes(searchpaciente)).map(item => item.nm_paciente);
        var pegaidpelobox = varatendimentos.filter(item =>
          item.Leito.descricao.includes(searchpaciente)).map(item => item.Leito.descricao);
        var pegaidpeloassistente = varatendimentos.filter(item =>
          item.nm_prestador.includes(searchpaciente)).map(item => item.nm_prestador);

        // filtrando pelo nome do paciente.
        if (pegapelonome != '' && pegaidpelobox == '' && pegaidpeloassistente == '') {
          setarrayatendimentos(todosatendimentos.filter(item => item.nm_paciente.includes(searchpaciente)));
          // filtrando pelo box/leito do paciente.
        } else if (pegapelonome == '' && pegaidpelobox != '' && pegaidpeloassistente == '') {
          setarrayatendimentos(todosatendimentos.filter(item => item.Leito.descricao.includes(searchpaciente)));
        } else if (pegapelonome == '' && pegaidpelobox == '' && pegaidpeloassistente != '') {
          setarrayatendimentos(todosatendimentos.filter(item => item.nm_prestador.includes(searchpaciente)));
        } else { setarraypacientes([]) }

        document.getElementById("inputFilterPaciente").value = searchpaciente;
        document.getElementById("inputFilterPaciente").focus();
      }
    }, 500);
  }

  const filterPacientePa = () => {
    clearTimeout(timeout);
    document.getElementById("inputFilterPacientePa").focus();
    searchatendimento = document.getElementById("inputFilterPacientePa").value.toUpperCase();
    console.log('BUCETA: ' + searchatendimento);
    timeout = setTimeout(() => {
      if (searchatendimento == '') {
        setarrayatendimentos(atendimentos);
        document.getElementById("inputFilterPacientePa").value = '';
        document.getElementById("inputFilterPacientePa").focus();
      } else {
        setfilterpaciente(document.getElementById("inputFilterPacientePa").value.toUpperCase());
        setarrayatendimentos(atendimentos.filter(item => item.nome.includes(searchatendimento) == true));
        document.getElementById("inputFilterPacientePa").value = searchatendimento;
        document.getElementById("inputFilterPacientePa").focus();
      }
    }, 500);
  }

  // função para extração dos pacientes em atendimento a partir da lista de atendimentos.
  const [arrayPacientesEmAtendimento, setarrayPacientesEmAtendimento] = useState([0, 1]);
  const MountArrayPacientesEmAtendimento = () => {
    arrayatendimentos.filter(item => item.Leito.unidade.id == idunidade).map(item => GetArrayPacientesEmAtendimento(item))
  }

  var varPacientesEmAtendimento = [];
  const GetArrayPacientesEmAtendimento = (valor) => {
    axios.get(htmlpacientes + valor.cd_paciente).then((response) => {
      varPacientesEmAtendimento.push(response.data);
      setarrayPacientesEmAtendimento([]);
      setarrayPacientesEmAtendimento(varPacientesEmAtendimento);
      settodospacientes(varPacientesEmAtendimento);
      // alert('PACIENTES: ' + todospacientes.length);
    });
  }

  // renderização do componente.
  if (viewtoten === 0 && renderchart == 1) {
    return (
      <div
        className="main fade-in"
      >
        <Header link={"/unidades"} titulo={JSON.stringify(nomehospital).substring(3, JSON.stringify(nomehospital).length - 1) + ' - ' + nomeunidade}></Header>

        <div
          id="PRINCIPAL"
          style={{
            display: 'flex',
            position: 'relative',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            width: '100%',
            height: '80vh',
            marginTop: 5,

          }}>
          <Chart></Chart>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '85vw',
              padding: 5,
            }}>
            <FilterPacientes></FilterPacientes>
            <CabecalhoInternacao></CabecalhoInternacao>
            <ShowPacientes></ShowPacientes>
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
}
export default Pacientes;
