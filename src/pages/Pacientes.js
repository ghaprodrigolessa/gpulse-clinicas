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

// leitor de qr code.
import QrReader from 'react-qr-reader';

// componentes do Paulo de Tarso (APT).
import AptPlanoTerapeutico from '../components/AptPlanoTerapeutico';

function Pacientes() {
  var html = 'https://pulsarapp-server.herokuapp.com';
  // recuperando estados globais (Context.API).
  const {
    idusuario,
    nomeusuario,
    tipousuario,
    especialidadeusuario,
    nomehospital,
    nomeunidade,
    tipounidade,
    idatendimento,
    setidatendimento,
  } = useContext(Context)
  // history (react-router-dom).
  let history = useHistory()

  // renderização do leitor de qr.
  const [recebepct, setrecebepct] = useState(0);
  const [qrscan, setqrscan] = useState('LOUCURA');

  console.log('DATA: ' + qrscan);

  const handleScan = (result) => {
    console.log('LENDO...')
    if (result) {
      setqrscan(result)
      console.log('FUNFOU')
      console.log('DATA: ' + qrscan);
      // lógica para atualizar registro de atendimento com a localização atual.
      var x = [];
      x = atendimentos.filter((item) => item.ativo != 0 && item.idpaciente == qrscan).slice(-1);
      console.log(x);
      setTimeout(() => {
        updateAtendimento(x, result);     
      }, 2000);
      setrecebepct(0);
    }
  }
  const handleError = err => {
    console.log('ERRO: ' + err)
  }
  
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
            delay={1000}
            onError={handleError}
            onScan={handleScan}
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
  const [leitos, setLeitos] = useState(10);
  const loadLeitos = () => {
    // ROTA: SELECT * FROM hospitaisxunidades WHERE hospital = hospital AND unidade = unidade.
    axios.get(html + "/totalleitosunidade/'" + nomehospital + "'/'" + nomeunidade + "'").then((response) => {
      var x = [0, 1];
      x = response.data;
      const arrayLeitos = x.map((item) => item.leitos);
      setLeitos(arrayLeitos[0]);
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
  const [atendimentos, setatendimentos] = useState([]);
  const [arrayatendimentos, setarrayatendimentos] = useState([]);
  const loadAtendimentos = () => {
    axios.get(html + "/atendimentos").then((response) => {
      var x = [0, 1];
      x = response.data;
      setatendimentos(x.filter((item) => item.ativo != 0 && item.hospital == nomehospital && item.unidade == nomeunidade));
      setarrayatendimentos(x.filter((item) => item.ativo != 0 && item.hospital == nomehospital && item.unidade == nomeunidade));
      setarrayatendimentosclassified(x.filter((item) => item.ativo != 0 && item.hospital == nomehospital && item.unidade == nomeunidade));
    });
  }

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
                setarrayatendimentosclassified(arrayatendimentos.sort(((a, b) => a.box > b.box ? 1 : -1)));
              } else if (classificabox == 1) {
                setclassificabox(2)
                setarrayatendimentosclassified(arrayatendimentos.sort(((a, b) => a.box < b.box ? 1 : -1)));
              }
            }}
            className="header-button"
            style={{ backgroundColor: 'transparent', color: classificabox == 0 ? '' : 'red' }}
            title="BOX"
          >
            {classificabox == 0 ? 'BOX' : classificabox == 1 ? 'BOX ↓' : 'BOX ↑'}
          </button>
          <button
            className="header-button"
            style={{ backgroundColor: 'transparent' }}
            title="BOX"
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
                setarrayatendimentosclassified(arrayatendimentos.sort(((a, b) => a.nome > b.nome ? 1 : -1)));
              } else if (classificanome == 1) {
                setclassificanome(2)
                arrayatendimentos.sort(((a, b) => a.nome < b.nome ? 1 : -1))
                setarrayatendimentosclassified(arrayatendimentos.sort(((a, b) => a.nome < b.nome ? 1 : -1)));
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
            onClick={() => {
              setclassificabox(0);
              setclassificanome(0);
              setclassificamif(0);
              // setclassificaidade(0);
              setclassificatempointernacao(0);
              setclassificaassistente(0);
              if (classificaidade == 0 || classificaidade == 2) {
                setclassificaidade(1)
                setarrayatendimentosclassified(arrayatendimentos.sort(((a, b) => a.dn > b.dn ? 1 : -1)));
              } else if (classificaidade == 1) {
                setclassificaidade(2)
                setarrayatendimentosclassified(arrayatendimentos.sort(((a, b) => a.dn < b.dn ? 1 : -1)));
              }
            }}
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
                setarrayatendimentosclassified(arrayatendimentos.sort(((a, b) => a.admissao > b.admissao ? 1 : -1)));
              } else if (classificatempointernacao == 1) {
                setclassificatempointernacao(2)
                setarrayatendimentosclassified(arrayatendimentos.sort(((a, b) => a.admissao < b.admissao ? 1 : -1)));
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
                setarrayatendimentosclassified(arrayatendimentos.sort(((a, b) => a.assistente > b.assistente ? 1 : -1)));
              } else if (classificaassistente == 1) {
                setclassificaassistente(2)
                setarrayatendimentosclassified(arrayatendimentos.sort(((a, b) => a.assistente > b.assistente ? 1 : -1)));
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
    if (arrayatendimentosclassified.length > 0) {
      return (
        <div
          id="LISTA DE PACIENTES"
          className="scroll"
          style={{ height: '100%' }}
        >
          {arrayatendimentosclassified.map((item) => (
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
                  display: arraypacientes.filter((value) => value.id === item.idpaciente).length > 0 ? 'flex' : 'none',
                }}
              >
                <button
                  className="grey-button"
                  style={{ minWidth: 50, margin: 2.5, color: '#ffffff', backgroundColor: 'grey' }}
                  title="BOX"
                  disabled="true"
                >
                  {item.box}
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
                  {item.precaucao == 1 ? 'P' : item.precaucao == 2 ? 'C' : item.precaucao == 3 ? 'G' : 'A'}
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
                    {arraypacientes.filter((value) => value.id === item.idpaciente).map((item) => item.nome)}
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
                  {moment().diff(moment(arraypacientes.filter((value) => value.id == item.idpaciente).map((item) => item.dn), 'DD/MM/YYYY'), 'years') > 1 ?
                    moment().diff(moment(arraypacientes.filter((value) => value.id == item.idpaciente).map((item) => item.dn), 'DD/MM/YYYY'), 'years') + ' ANOS.' :
                    moment().diff(moment(arraypacientes.filter((value) => value.id == item.idpaciente).map((item) => item.dn), 'DD/MM/YYYY'), 'years') + ' ANO.'
                  }
                </button>
                <button
                  className="rowitem"
                  style={{
                    display: window.innerWidth < 400 ? 'none' : 'flex',
                    width: '30%',
                  }}
                >
                  {moment().diff(moment(item.admissao, 'DD/MM/YYYY'), 'days') + ' DIAS.'}
                </button>
                <button
                  className="rowitem"
                  style={{
                    display: window.innerWidth < 400 ? 'none' : 'flex',
                    width: '30%',
                  }}
                >
                  <div>
                    {item.assistente}
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

  function CabecalhoPa() {
    return (
      <div
        className="scrollheader"
        id="CABEÇALHO DA LISTA DE PACIENTES NO PRONTO-ATENDIMENTO"
      >
        <div className="rowheader">
          <button
            className="rowitem"
            title="HORA DE ENTRADA."
            style={{
              display: window.innerWidth > 400 ? 'flex' : 'none',
              width: '15%',
            }}
            disabled="true"
          >
            ENTRADA
          </button>
          <button
            className="rowitem"
            title="TEMPO DE ESPERA."
            style={{
              display: window.innerWidth > 1024 ? 'flex' : 'none',
              justifyContent: 'center',
              width: '20%',
            }}
            disabled="true"
          >
            ESPERA
          </button>
          <button
            className="rowitem"
            title="BOX/LEITO."
            style={{ minWidth: 50, width: 50 }}
          >
            BOX
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
            title="CLIQUE PARA CHAMAR O PACIENTE."
            className="header-button"
            style={{
              display: window.innerWidth > 400 ? 'flex' : 'none',
              height: 50,
              width: 50,
            }}
          >
          </button>
          <button
            className="rowitem"
            style={{
              minWidth: window.innerWidth > 800 ? '15%' : 50,
              width: window.innerWidth > 800 ? '15%' : 50,
            }}
          >
            IDADE
          </button>
        </div>
      </div>
    )
  }

  // renderização da lista de pacientes, perfil PRONTO-ATENDIMENTO.
  function ShowPacientesPa() {
    if (atendimentos.length > 0) {
      return (
        <div
          className="scroll"
          id="LISTA DE PACIENTES"
        >
          {arrayatendimentos.sort(((a, b) => a.classificacao > b.classificacao ? 1 : -1)).map((item) => (
            <div
              key={item.id}
              className="row"
              style={{
                position: 'relative',
                opacity: item.classificacao === 0 ? 0.5 : 1,
              }}
            >
              <button
                className="rowitem"
                title="HORA DE ENTRADA."
                style={{
                  display: window.innerWidth > 400 ? 'flex' : 'none',
                  width: '15%',
                }}
                disabled="true"
              >
                {item.admissao}
              </button>
              <button
                className="rowitem"
                title="TEMPO DE ESPERA."
                style={{
                  display: window.innerWidth > 1024 ? 'flex' : 'none',
                  justifyContent: 'center',
                  width: '20%',
                }}
                disabled="true"
              >
                {espera(item.admissao)}
              </button>
              <button
                className="rowitem"
                title="BOX/LEITO."
                style={{ minWidth: 50, width: 50 }}
              >
                {item.box}
              </button>
              <button
                onClick={() => selectPaciente(item)}
                disabled={item.classificacao === 0 ? true : false}
                title={item.classificacao === 0 ? 'PACIENTE AGUARDA TRIAGEM, NÃO É POSSÍVEL ATENDER.' : 'DESCRITOR: ' + item.descritor + '. CLIQUE PARA ATENDER.'}
                className={
                  item.classificacao === 1 ? "red-button" :
                    item.classificacao === 2 ? "orange-button" :
                      item.classificacao === 3 ? "yellow-button" :
                        item.classificacao === 4 ? "green-button" : "blue-button"
                }
                style={{
                  height: 50,
                  width: '100%',
                }}
              >
                <div>
                  {item.nome}
                </div>
              </button>
              <button
                onClick={() => insertCall(item, consultorio)}
                title="CLIQUE PARA CHAMAR O PACIENTE."
                className="blue-button"
                disabled={item.ativo == 2 ? true : false}
                style={{
                  display: window.innerWidth > 400 ? 'flex' : 'none',
                  opacity: item.ativo == 2 ? 0.5 : 1,
                  height: 50,
                  width: 50,
                }}
              >
                <img alt="" src={call} style={{ height: 30, width: 30 }}></img>
              </button>
              <button
                className="rowitem"
                style={{
                  minWidth: window.innerWidth > 800 ? '15%' : 50,
                  width: window.innerWidth > 800 ? '15%' : 50,
                }}
              >
                {moment().diff(moment(listpacientes.filter((value) => value.id == item.idpaciente).map((item) => item.dn), 'DD/MM/YYYY'), 'years') > 1 ?
                  moment().diff(moment(listpacientes.filter((value) => value.id == item.idpaciente).map((item) => item.dn), 'DD/MM/YYYY'), 'years') + ' ANOS.' :
                  moment().diff(moment(listpacientes.filter((value) => value.id == item.idpaciente).map((item) => item.dn), 'DD/MM/YYYY'), 'years') + ' ANO.'
                }
              </button>
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
            height: '100%',
            overflowY: 'hidden',
          }}
        >
          <div className="title2"
            style={{
              fontSize: 16,
              opacity: 0.5,
              alignSelf: 'center',
              textAlign: 'center',
            }}>
            {'NÃO HÁ PACIENTES INTERNADOS NÃO CLASSIFICADOS NESTA UNIDADE.'}
          </div>
        </div>
      )
    }
  }

  // CHART.
  /* gráfico em torta que exibe o total de pacientes internados na unidade, distribuídos
  por linha de cuidado. */
  const dataChart = {
    labels: [' PACIENTE CRÔNICO', ' CUIDADOS PALIATIVOS', ' REABILITAÇÃO', ' LEITOS LIVRES'],
    datasets: [
      {
        data: [
          atendimentos.filter((item) => item.linhadecuidado === 1).length,
          atendimentos.filter((item) => item.linhadecuidado === 2).length,
          atendimentos.filter((item) => item.linhadecuidado === 3).length,
          leitos - (
            atendimentos.filter((item) => item.linhadecuidado === 1).length +
            atendimentos.filter((item) => item.linhadecuidado === 2).length +
            atendimentos.filter((item) => item.linhadecuidado === 3).length)
        ],
        backgroundColor: ['#52be80', '#5DADE2', '#F4D03F', 'grey'],
        borderWidth: 5,
        borderColor: '#f2f2f2',
        hoverBorderColor: ['#f2f2f2', '#f2f2f2'],
      },
    ],
  };
  const dataChartPa = {
    labels: [' EMERGÊNCIA', ' MUITO URGENTE', ' URGENTE', ' NÃO URGENTE', 'NÃO CLASSIFICADOS'],
    datasets: [
      {
        data: [
          atendimentos.filter((item) => item.classificacao == 1).length,
          atendimentos.filter((item) => item.classificacao == 2).length,
          atendimentos.filter((item) => item.classificacao == 3).length,
          atendimentos.filter((item) => item.classificacao == 4).length,
          atendimentos.filter((item) => item.classificacao == 0).length,
          leitos - (
            atendimentos.filter((item) => item.classificacao == 1).length +
            atendimentos.filter((item) => item.classificacao == 2).length +
            atendimentos.filter((item) => item.classificacao == 3).length +
            atendimentos.filter((item) => item.classificacao == 4).length +
            atendimentos.filter((item) => item.classificacao == 0).length)
        ],
        backgroundColor: [
          '#ec7063', // vermelho.
          '#eb984e', // laranja.
          '#f5b041', // amarelo.
          '#52be80', // verde.
          '#B5BED8', // não classificados.
          'grey', // vago.
        ],
        borderColor: '#f2f2f2',
        hoverBorderColor: ['#f2f2f2', '#f2f2f2', '#f2f2f2', '#f2f2f2'],
      },
    ],
  };
  function Chart() {
    if (atendimentos.length > 0) {
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
          <div id="chart" style={{
            display: renderchart == 1 ? 'flex' : 'none',
            flexDirection: 'column', justifyContent: 'center', alignSelf: 'center',
            position: 'relative'
          }}>
            <Doughnut
              data={tipounidade == 2 ? dataChart : dataChartPa}
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
                  duration: 500,
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
                {Math.ceil(atendimentos.length * 100 / leitos) + '%'}
              </p>
            </div>
          </div>
          <Legenda></Legenda>
          <LegendaPa></LegendaPa>
        </div>
      );
    } else {
      return null;
    }
  }

  // legenda para o gráfico.
  function Legenda() {
    return (
      <div id="LEGENDA"
        className="legendinha"
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
              backgroundColor: 'grey',
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
        <div style={{
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center',
          width: window.innerWidth > 400 ? '' : '30vw'
        }}>
          <div
            id="PACIENTES CRÔNICOS"
            className="secondary"
            style={{
              width: 20,
              height: 20,
              borderRadius: 5,
              backgroundColor: '#52be80',
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
            CRÔNICOS
          </p>
        </div>
        <div style={{
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center',
          width: window.innerWidth > 400 ? '' : '30vw'
        }}>
          <div
            id="CUIDADOS PALIATIVOS"
            className="secondary"
            style={{
              width: 20,
              height: 20,
              borderRadius: 5,
              backgroundColor: '#5DADE2',
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
            PALIATIVOS
          </p>
        </div>
        <div style={{
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center',
          width: window.innerWidth > 400 ? '' : '30vw'
        }}>
          <div
            id="REABILITAÇÃO"
            className="secondary"
            style={{
              width: 20,
              height: 20,
              borderRadius: 5,
              backgroundColor: '#F4D03F',
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
            REABILITAÇÃO
          </p>
        </div>
      </div>
    );
  }
  function LegendaPa() {
    return (
      <div
        id="legenda"
        className="secondary legendinha"
        style={{ display: tipounidade == 1 ? 'flex' : 'none', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', boxShadow: 'none', width: 240 }}
      >
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <div
            id="POUCO URGENTE"
            style={{
              minWidth: 20,
              width: 20,
              height: 20,
              borderRadius: 5,
              backgroundColor: '#52be80',
              margin: 2.5,
              padding: 0,
            }}
          >
          </div>
          <div
            className="title2"
            style={{ display: 'flex', margin: 2.5, fontSize: 10, padding: 0, textAlign: 'left', alignSelf: 'center' }}
          >
            {'POUCO URGENTE'}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <div
            id="URGENTE"
            style={{
              minWidth: 20,
              width: 20,
              height: 20,
              borderRadius: 5,
              backgroundColor: '#f39c12',
              margin: 2.5,
              padding: 0,
            }}
          >
          </div>
          <div
            className="title2"
            style={{ display: 'flex', margin: 2.5, fontSize: 10, padding: 0, textAlign: 'left', alignSelf: 'center' }}
          >
            {'URGENTE'}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <div
            id="MUITO URGENTE"
            style={{
              minWidth: 20,
              width: 20,
              height: 20,
              borderRadius: 5,
              backgroundColor: '#eb984e',
              margin: 2.5,
              padding: 0,
            }}
          >
          </div>
          <div
            className="title2"
            style={{ display: 'flex', margin: 2.5, fontSize: 10, padding: 0, textAlign: 'left', alignSelf: 'center' }}
          >
            {'MUITO URGENTE'}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <div
            id="EMERGÊNCIA"
            style={{
              minWidth: 20,
              width: 20,
              height: 20,
              borderRadius: 5,
              backgroundColor: '#ec7063',
              margin: 2.5,
              padding: 0,
            }}
          >
          </div>
          <div
            className="title2"
            style={{ display: 'flex', margin: 2.5, fontSize: 10, padding: 0, textAlign: 'left', alignSelf: 'center' }}
          >
            {'EMERGÊNCIA'}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <div
            id="NÃO CLASSIFICADOS"
            style={{
              minWidth: 20,
              width: 20,
              height: 20,
              borderRadius: 5,
              backgroundColor: '#B5BED8',
              margin: 2.5,
              padding: 0,
            }}
          >
          </div>
          <div
            className="title2"
            style={{ display: 'flex', margin: 2.5, fontSize: 10, padding: 0, textAlign: 'left', alignSelf: 'center' }}
          >
            {'NÃO CLASSIFICADOS'}
          </div>
        </div>
      </div>
    );
  }

  // selecionando um paciente da lista e abrindo a tela corrida.
  const selectPaciente = (item) => {
    setidatendimento(item.id)
    history.push('/prontuario')
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
    setclassificabox(1);
    loadPacientes();
    loadAtendimentos();
    loadAmbulatorio();
    setTimeout(() => {
      setrenderchart(1);
    }, 1000);
    if (viewtoten === 1) {
      setInterval(() => {
        loadCalls();
      }, 5000);
    }
    // definindo o modo de exibição da lista de pacientes (INTERNAÇÃO X PRONTO-ATENDIMENTO).
    if (tipounidade === 1) {
      setviewconsultorioselector(1);
    }
    // carregando o total de leitos da unidade.
    loadLeitos();
  }, [viewtoten]);

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

  function FilterPacientesPa() {
    return (
      <input
        className="input"
        autoComplete="off"
        placeholder="BUSCAR PACIENTE..."
        onFocus={(e) => (e.target.placeholder = '')}
        onBlur={(e) => (e.target.placeholder = 'BUSCAR...')}
        onChange={() => filterPacientePa()}
        style={{
          width: '60vw',
          padding: 20,
          margin: 20,
          alignSelf: 'center',
          textAlign: 'center'
        }}
        type="text"
        id="inputFilterPacientePa"
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
        setarraypacientes(listpacientes);
        document.getElementById("inputFilterPaciente").value = '';
        document.getElementById("inputFilterPaciente").focus();
      } else {
        setfilterpaciente(document.getElementById("inputFilterPaciente").value.toUpperCase());

        var pegapelonome = listpacientes.filter(item =>
          item.nome.includes(searchpaciente)).map(item => item.nome);
        var pegaidpelobox = atendimentos.filter(item =>
          item.box.includes(searchpaciente)).map(item => item.idpaciente);
        var pegaidpeloassistente = atendimentos.filter(item =>
          item.assistente.includes(searchpaciente)).map(item => item.idpaciente);

        //alert('NOME: ' + pegapelonome);
        //alert('IDBOX: ' + pegaidpelobox);
        //alert('IDASSISTENTE: ' + pegaidpeloassistente);

        if (pegapelonome != '' && pegaidpelobox == '' && pegaidpeloassistente == '') {
          setarraypacientes(listpacientes.filter(item => item.nome.includes(searchpaciente)));

        } else if (pegapelonome == '' && pegaidpelobox != '' && pegaidpeloassistente == '') {
          setarraypacientes(listpacientes);
          var newarraypacientes = []
          newarraypacientes = pegaidpelobox.map(item => JSON.stringify(listpacientes.filter(value => value.id == item)));
          document.getElementById("inputFilterPaciente").focus();
          setarraypacientes(JSON.parse(newarraypacientes));

        } else if (pegapelonome == '' && pegaidpelobox == '' && pegaidpeloassistente != '') {
          setarraypacientes(listpacientes);
          var newarraypacientes = []
          newarraypacientes = pegaidpeloassistente.map(item => JSON.stringify(listpacientes.filter(value => value.id == item)));
          document.getElementById("inputFilterPaciente").focus();
          setarraypacientes(JSON.parse(newarraypacientes));

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

  // renderização do componente.
  if (viewtoten === 0 && renderchart == 1) {
    return (
      <div
        className="main fade-in"
      >
        <Header link={"/unidades"} titulo={nomehospital + ' - ' + nomeunidade}></Header>
        <QRScanner></QRScanner>
        <div
          id="PRINCIPAL"
          style={{
            display: tipounidade == 2 && window.innerWidth > 400 ? 'flex' : 'none',
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
              display: tipounidade == 2 ? 'flex' : 'none',
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
        <div
          id="PRINCIPAL"
          style={{
            display: tipounidade == 1 && window.innerWidth > 400 ? 'flex' : 'none',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            width: '100%',
            height: window.innerWidth < 800 ? 0.785 * window.innerHeight : '100%',
            marginTop: 5
          }}>
          <Chart></Chart>
          <div
            className="scroll"
            style={{
              display: tipounidade == 1 ? 'flex' : 'none',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100%',
              borderRadius: 0,
              backgroundColor: 'transparent',
              borderColor: 'transparent',
            }}>
            <ShowToten></ShowToten>
            <FilterPacientesPa></FilterPacientesPa>
            <CabecalhoPa></CabecalhoPa>
            <ShowPacientesPa></ShowPacientesPa>
            <ConsultorioSelector></ConsultorioSelector>
          </div>
        </div>
        <div
          id="PRINCIPAL"
          className="scroll"
          style={{
            display: tipounidade == 2 && window.innerWidth < 400 ? 'flex' : 'none',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
          }}>
          <Chart></Chart>
          <div
            className="scrollgroup"
            style={{
              display: tipounidade == 2 ? 'flex' : 'none',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100%',
            }}>
            <FilterPacientes></FilterPacientes>
            <CabecalhoInternacao></CabecalhoInternacao>
            <ShowPacientes></ShowPacientes>
          </div>
        </div>
        <div
          id="PRINCIPAL"
          className="scroll"
          style={{
            display: tipounidade == 1 && window.innerWidth < 400 ? 'flex' : 'none',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            width: '100%',
            height: window.innerWidth < 400 ? 0.785 * window.innerHeight : '100%',
            marginTop: 5
          }}>
          <Chart></Chart>
          <div
            style={{
              display: tipounidade == 1 ? 'flex' : 'none',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100%',
            }}>
            <ShowToten></ShowToten>
            <FilterPacientes></FilterPacientes>
            <CabecalhoInternacao></CabecalhoInternacao>
            <ShowPacientes></ShowPacientes>
            <ConsultorioSelector></ConsultorioSelector>
          </div>
        </div>
      </div >
    );
  } else if (viewtoten === 1 && renderchart == 1) {
    return (
      <div
        className="main fade-in"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          overflowY: window.innerWidth > 800 ? 'hidden' : 'scroll',
          overflowX: 'hidden',
          width: '100vw',
          height: '95vh',
          margin: 0,
          padding: 20,
        }}
      >
        <label className="title2" style={{ fontSize: 30, margin: 10 }}>
          {'ÚLTIMA CHAMADA - ' + nomeunidade}
        </label>
        <div
          className="row"
          style={{ marginTop: 0, margin: 5, justifyContent: 'center', flexDirection: 'row' }}
        >
          <div
            className="green-button" style={{ fontSize: 30, padding: 10, width: 0.2 * window.innerWidth }}
          >
            {listcalls.filter(item =>
              moment(JSON.stringify(item.data).substring(1, 15), "DD/MM/YY HH:mm") > moment().subtract(30, 'minutes') &&
              item.hospital == nomehospital && item.unidade == nomeunidade).map(item => item.data).pop()
            }
          </div>
          <div className="green-button" style={{ fontSize: 30, padding: 10, width: '100%' }}>
            {listcalls.filter(item =>
              moment(JSON.stringify(item.data).substring(1, 15), "DD/MM/YY HH:mm") > moment().subtract(30, 'minutes') &&
              item.hospital == nomehospital && item.unidade == nomeunidade).map(item => item.paciente).pop()
            }
          </div>
          <div className="green-button" style={{ fontSize: 30, padding: 10, width: 0.3 * window.innerWidth, flexDirection: 'column' }}>
            <div style={{ fontSize: 20 }}>
              {'CONSULTÓRIO:'}
            </div>
            <div style={{ fontSize: 40 }}>
              {listcalls.filter(item =>
                moment(JSON.stringify(item.data).substring(1, 15), "DD/MM/YY HH:mm") > moment().subtract(30, 'minutes') &&
                item.hospital == nomehospital && item.unidade == nomeunidade).map(item => item.consultorio).pop()
              }
            </div>
            <div style={{ fontSize: 20, marginTop: 10 }}>
              {'PROFISSIONAL:'}
            </div>
            <div>
              {listcalls.filter(item =>
                moment(JSON.stringify(item.data).substring(1, 15), "DD/MM/YY HH:mm") > moment().subtract(30, 'minutes') &&
                item.hospital == nomehospital && item.unidade == nomeunidade).map(item => item.usuario).pop()
              }
            </div>
          </div>
        </div>
        <label
          className="title2"
          style={{ margin: 0, fontSize: 24, padding: 0 }}
        >
          {'CHAMADAS RECENTES'}
        </label>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%', alignItems: 'center', margin: 5, padding: 5, paddingRight: 10, paddingBottom: 0, marginBottom: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: 0.15 * window.innerWidth, textAlign: 'center', margin: 2.5 }}>
            <div className="title2" style={{ width: '60%', textAlign: 'center', margin: 2.5, paddingLeft: 20 }}>HORA DA CHAMADA:</div>
          </div>
          <div className="title2" style={{ width: '100%', textAlign: 'center', margin: 2.5 }}>NOME DO CLIENTE:</div>
          <div className="title2" style={{ width: 0.15 * window.innerWidth, textAlign: 'center', margin: 2.5, alignSelf: 'center' }}>CONSULTÓRIO:</div>
        </div>
        <div
          id="ÚLTIMAS CHAMADAS"
          style={{
            justifyContent: 'flex-start',
            margin: 5,
            padding: 0,
            width: '100%',
          }}
        >
          {listcalls.filter((item) => moment(JSON.stringify(item.data).substring(1, 15), "DD/MM/YY HH:mm") > moment().subtract(30, 'minutes') && item.hospital == nomehospital && item.unidade == nomeunidade).slice(-4, -1).map(item => (
            <div className="rowitem" key={item.id} style={{ marginBottom: 2.5 }}>
              <div
                className="blue-button"
                style={{ minHeight: 65, height: 65, width: 0.15 * window.innerWidth, margin: 2.5, fontSize: 20, padding: 10 }}
              >
                {JSON.stringify(item.data).substring(1, 15)}
              </div>
              <div
                className="blue-button"
                style={{ minHeight: 65, height: 65, width: '100%', margin: 2.5, fontSize: 20, padding: 10 }}
              >
                {item.paciente}
              </div>
              <div
                className="blue-button"
                style={{ minHeight: 65, height: 65, width: 0.15 * window.innerWidth, margin: 2.5, fontSize: 20, padding: 10 }}
              >
                {item.consultorio}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    return null;
  }
}
export default Pacientes;
