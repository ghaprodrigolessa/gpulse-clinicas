/* eslint eqeqeq: "off" */

/* 
REFERÊNCIAS IMPORTANTES: 
a) tipousuario: técnico = 4, farmácia = 6, enfermeira = 5, secretária = 3, médico = 1, chefe = 2
b) tipounidade: 1 = pronto-atendimento, 2 = unidades de internação (enfermarias, ctis), 3 = bloco cirúrgico, 4 = ambulatórios.
*/

// importando bibliotecas.
import React, { useState, useContext, useCallback } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/pt-br';
import Context from '../Context';
import { useHistory } from "react-router-dom";
import { Link } from 'react-router-dom';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
// importando css.
import '../design.css';
// importando imagens.
import rxmockado from '../images/rxmockado.png'; // mock do Guilherme!
import body from '../images/body.png';
import dorso from '../images/dorso.svg';
import Logo from '../components/Logo';
import LogoInverted from '../components/LogoInverted';
import newlogo from '../images/newlogo.svg';
import historico from '../images/historico.svg'
import deletar from '../images/deletar.svg';
import suspender from '../images/suspender.svg';
import editar from '../images/editar.svg';
import salvar from '../images/salvar.svg';
import copiar from '../images/copiar.svg';
import invasoes from '../images/invasoes.svg';
import curativo from '../images/curativo.svg';
import settingsimg from '../images/settings.svg'
import viewimage from '../images/viewimage.svg';
import imprimir from '../images/imprimir.svg';
import novo from '../images/novo.svg';
import menu from '../images/menu.svg';
import microfone from '../images/microfone.svg';
import logoff from '../images/power.svg';
import back from '../images/back.svg';
import foto from '../images/3x4.jpg';
import clock from '../images/clock.svg';
import info from '../images/info.svg';
import leito0 from '../images/leito0.svg';
import leito30 from '../images/leito30.svg';
import leito90 from '../images/leito90.svg';
import fowler from '../images/leitofowler.svg';
// importando componentes de sobreposição.
import UpdateAtendimento from '../components/UpdateAtendimento';
import Settings from '../components/Settings';
import Evolucao from '../components/Evolucao';
import Diagnostico from '../components/Diagnosticos';
import EscalasAssistenciais from '../pages/EscalasAssistenciais';
import Problemas from '../components/Problemas';
import Propostas from '../components/Propostas';
import Interconsultas from '../components/Interconsultas';
import Laboratorio from '../components/Laboratorio';
import Imagem from '../components/Imagem';
import Balanco from '../components/Balanco';
import Formularios from '../components/Formularios';
import PrintEvolucao from '../components/PrintEvolucao';
import Toast from '../components/Toast';
import DatePicker from '../components/DatePicker';
import Prescricao from '../components/Prescricao';
import PrintFormulario from '../components/PrintFormulario';

// importando gráficos.

import { Line, Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import 'chartjs-plugin-style';

// componentes do Paulo de Tarso (APT).
import AptPlanoTerapeutico from '../components/AptPlanoTerapeutico';
import AptEscalaPPS from '../components/AptEscalaPPS';
import AptEscalaMIF from '../components/AptEscalaMIF';
import AptEscalaIVCF from '../components/AptEscalaIVCF';
import AptIVCF from '../components/AptIVCF';

// importando gerador de qr code.
// import { useQRCode } from 'react-qrcode';
import QRcode from 'qrcode.react';

function Prontuario() {
  moment.locale('pt-br');
  var html = 'https://pulsarapp-server.herokuapp.com';
  var htmldadosvitais = process.env.REACT_APP_API_FILTRADADOSVITAIS;
  var htmlbalancohidrico = process.env.REACT_APP_API_BALANCOHIDRICO;

  // recuperando estados globais (Context.API).
  const {
    idunidade,
    idusuario,
    nomeusuario,
    tipousuario,
    especialidadeusuario,
    conselhousuario,
    nomehospital,
    nomeunidade,
    tipounidade,
    // atendimento e paciente.
    setdadospaciente, dadospaciente,
    // todos os leitos e atendimentos.
    todosleitos,
    todospacientes,
    todosatendimentos,
    historicoatendimentos, sethistoricoatendimentos,

    setidatendimento,
    idatendimento,
    convenio, setconvenio,
    datainternacao, setdatainternacao,
    setidpaciente,
    idpaciente,
    nomepaciente, setnomepaciente,
    dn, setdn,
    box, setbox,
    setpickdate1,
    pickdate1,
    setpickdate2,
    pickdate2,
    stateprontuario,
    setstateprontuario,
    scrolllist, setscrolllist,
    scrollmenu, setscrollmenu,
    // listas.
    listevolucoes, setlistevolucoes,
    arrayevolucao, setarrayevolucao,
    listdiagnosticos, setlistdiagnosticos,
    arraydiagnosticos, setarraydiagnosticos,
    listproblemas, setlistproblemas,
    arrayproblemas, setarrayproblemas,
    listpropostas, setlistpropostas,
    arraypropostas, setarraypropostas,
    listinterconsultas, setlistinterconsultas,
    arrayinterconsultas, setarrayinterconsultas,
    listlaboratorio, setlistlaboratorio,
    arraylaboratorio, setarraylaboratorio,
    listimagem, setlistimagem,
    arrayimagem, setarrayimagem,
    listbalancos, setlistbalancos,
    listformularios, setlistformularios,
    arrayformularios, setarrayformularios,
    // settings:
    viewsettings, setviewsettings,
    settings, setsettings,
    // menu principal.
    menuevolucoes, setmenuevolucoes,
    menudiagnosticos, setmenudiagnosticos,
    menuproblemas, setmenuproblemas,
    menupropostas, setmenupropostas,
    menuinterconsultas, setmenuinterconsultas,
    menulaboratorio, setmenulaboratorio,
    menuimagem, setmenuimagem,
    menuprescricao, setmenuprescricao,
    menuformularios, setmenuformularios,
    // cards.
    cardinvasoes, setcardinvasoes,
    cardlesoes, setcardlesoes,
    cardstatus, setcardstatus,
    cardalertas, setcardalertas,
    cardprecaucao, setcardprecaucao,
    cardriscosassistenciais, setcardriscosassistenciais,
    carddiasinternacao, setcarddiasinternacao,
    cardultimaevolucao, setcardultimaevolucao,
    carddiagnosticos, setcarddiagnosticos,
    cardhistoricoatb, setcardhistoricoatb,
    cardhistoricoatendimentos, setcardhistoricoatendimentos,
    cardanamnese, setcardanamnese,
    // colorcheme.
    schemecolor, setschemecolor,
    // APT IVCF / curva de Moraes.
    ivcf, setivcf,
    setrefreshatendimentos, refreshatendimentos,
    linhadecuidado, setlinhadecuidado,
    // escalas.
    showescala, setshowescala,
  } = useContext(Context)
  // history (react-router-dom).
  let history = useHistory()

  // speech recognizer (better).
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const [qr, setqr] = useState(idpaciente);

  const [showqr, setshowqr] = useState(0);
  function ShowQr() {
    return (
      <div style={{ position: 'absolute', top: 30, left: 30, borderRadius: 5 }}>
        <div style={{ display: showqr == 1 ? 'flex' : 'none', position: 'relative' }}>
          <QRcode
            id="myqr"
            value={qr.toString()}
            size={128}
            includeMargin={true}
            style={{ borderRadius: 5 }}
            onClick={() => setshowqr(0)}
          />
        </div>
      </div>
    )
  }

  function GetSpeech() {
    if (/Android/i.test(navigator.userAgent)) {
      return (
        <button
          style={{
            display: window.innerWidth < 800 && (stateprontuario == 2 || stateprontuario == 4) ? 'flex' : 'none',
            position: 'fixed',
            bottom: 5,
            marginLeft: 0, marginRight: 0,
            borderRadius: 50,
            height: 65, width: 65,
            opacity: 1,
            zIndex: 1
          }}
          className={listening ? "red-button" : "purple-button"}
          onTouchStart={
            listening ?
              () => { SpeechRecognition.stopListening(); insertSpeech(); resetTranscript() } :
              () => { resetTranscript(); SpeechRecognition.startListening({ continuous: true }); }
          }
        >
          <img
            alt=""
            src={microfone}
            style={{
              margin: 10,
              height: 30,
              width: 30,
            }}
          ></img>
        </button>
      )
    } else {
      return null;
    }
  }

  function ShowSpeech() {
    return (
      <button className="green-button"
        style={{
          display: transcript.length > 0 ? 'flex' : 'none',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'fixed',
          bottom: 100,
          marginLeft: 0, marginRight: 0,
          maxWidth: 0.6 * window.innerWidth,
          maxHeight: 0.5 * window.innerHeight,
          padding: 10
        }}>
        {transcript.toUpperCase()}
        <button className="red-button"
          onClick={() => resetTranscript()}
          style={{ margin: 0, marginTop: 10 }}
        >
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
      </button>
    )
  }

  const insertSpeech = () => {
    if (stateprontuario == 2 && transcript.length > 0) { // evolução.
      var obj = {
        idpaciente: idpaciente,
        idatendimento: idatendimento,
        data: moment().format('DD/MM/YY HH:mm'),
        evolucao: transcript.toUpperCase(),
        pas: '',
        pad: '',
        fc: '',
        fr: '',
        sao2: '',
        tax: '',
        diu: '',
        fezes: '',
        bh: '',
        acv: '',
        ap: '',
        abdome: '',
        outros: '',
        glasgow: 0,
        rass: 0,
        ramsay: 0,
        hd: 0,
        uf: 0,
        heparina: 0,
        braden: 0,
        morse: 0,
        status: 0,
        idusuario: idusuario,
        funcao: tipousuario,
        usuario: nomeusuario,
      };
      axios.post(html + '/insertevolucao', obj).then(() => {
        toast(1, '#52be80', 'EVOLUÇÃO INSERIDA COM SUCESSO', 3000);
        resetTranscript();
        // loadEvolucoes(idpaciente);
      });
    } else if (stateprontuario == 4 && transcript.length > 0) {
      var obj = {
        idatendimento: idatendimento,
        inicio: moment().format('DD/MM/YYYY'),
        termino: '',
        proposta: transcript.toUpperCase(),
      };
      axios.post(html + '/insertprop', obj).then(() => {
        toast(1, '#52be80', 'PROPOSTA REGISTRADA COM SUCESSO.', 3000);
        resetTranscript();
      });
    } else {
    }
  }

  // estados relacionados ao paciente e seu atendimento.
  const [peso, setpeso] = useState('');
  const [altura, setaltura] = useState('');
  const [admissao, setadmissao] = useState('');
  const [antecedentes, setantecedentes] = useState('');
  const [alergias, setalergias] = useState([]);
  const [diagnosticoprincipal, setdiagnosticoprincipal] = useState('');
  const [medicacoes, setmedicacoes] = useState('');
  const [exames, setexames] = useState('');
  const [historia, sethistoria] = useState('');
  const [status, setstatus] = useState(0);
  const [ativo, setativo] = useState('');
  var statusatendimento = 0;
  const [classificacao, setclassificacao] = useState('');
  const [descritor, setdescritor] = useState('');
  const [precaucao, setprecaucao] = useState(0);
  const [assistente, setassistente] = useState('SEM MÉDICO ASSISTENTE');

  // carregando os dados do paciente.
  const [listpacientes, setlistpacientes] = useState([]);
  const [nomemae, setnomemae] = useState('');
  const [contato, setcontato] = useState('');
  const [endereço, setendereço] = useState('');

  const loadPaciente = (valor) => {
    var paciente = [0, 1]
    paciente = todospacientes.filter(value => value.codigo_paciente == valor)
    setnomepaciente(todospacientes.filter(value => value.codigo_paciente == valor).map(item => item.nome_paciente))
    setnomemae(paciente.map(item => item.nome_mae_paciente))
    setcontato("INDISPONÍVEL NA API");
    setendereço("INDISPONÍVEL NA API");
    setdn(moment(paciente.map(item => item.data_nascimento_paciente), 'YYYY-MM-DD').format('DD/MM/YYYY'));
    setidade(moment().diff(moment(dn), 'DD/MM/YYYY'), 'years');
    // alert(dn);
  }

  // carregando o histórico de atendimentos do paciente.
  var htmlhistoricodeatendimentos = process.env.REACT_APP_API_HISTORICODEATENDIMENTOS;
  const [historicodeatendimentos, sethistoricodeatendimentos] = useState([0, 1]);
  const loadHistoricoDeAtendimentos = () => {
    axios.get(htmlhistoricodeatendimentos + idpaciente).then((response) => {
      var x = [0, 1]
      x = response.data;
      // alert('LISTA DE ATENDIMENTOS: ' + x.length);
      sethistoricoatendimentos(x);
      sethistoricodeatendimentos(x);
    })
  }

  // carregando o atendimento do paciente selecionado.
  const [listatendimentos, setlistatendimentos] = useState([]);
  const loadAtendimento = (valor) => {
    var atendimento = [0, 1]
    atendimento = todosatendimentos.filter(value => value.cd_paciente == valor)
    setbox(atendimento.map(item => item.Leito.descricao));
    setdiasinternado(moment().diff(moment(atendimento.map(item => item.dt_hr_atendimento), 'YYYY/MM/DD'), 'days'));
    setadmissao(moment(atendimento.map(item => item.dt_hr_atendimento)).format('DD/MM/YYYY'));
    setantecedentes('INDISPONÍVEL NA API');
    var ciddiagnostico = atendimento.map(item => item.cd_cid);
    var descricaodiagnostico = JSON.stringify(atendimento.map(item => item.ds_cid)).substring(2, 30).replace('"', '').replace(']', '');
    setdiagnosticoprincipal(ciddiagnostico + ' - ' + descricaodiagnostico + '...');

    setmedicacoes('INDISPONÍVEL NA API');
    setexames('INDISPONÍVEL NA API');
    sethistoria('INDISPONÍVEL NA API');
    setstatus('INDISPONÍVEL NA API');
    setprecaucao('INDISPONÍVEL NA API');
    setativo('INDISPONÍVEL NA API');
    setclassificacao('INDISPONÍVEL NA API')
  }

  // carregando as evoluções do paciente selecionado.
  var htmlevolucoes = process.env.REACT_APP_API_EVOLUCAO;
  const loadEvolucoes = () => {
    axios.get(htmlevolucoes + idatendimento).then((response) => {
      var x = [0, 1];
      x = response.data;
      setlistevolucoes(x.sort((a, b) => a.id < b.id ? 1 : -1));
      setarrayevolucao(x.sort((a, b) => a.id < b.id ? 1 : -1));
      // alert(x.lenght)
    });
  }

  // calculando idade em anos e dias de internação.
  const [idade, setidade] = useState(0);
  const [diasinternado, setdiasinternado] = useState(0);

  // estados relacionados às invasões.
  const [idinv, setidinv] = useState(0);
  const [snc, setsnc] = useState(0);
  const [datasnc, setdatasnc] = useState('');
  const [va, setva] = useState(0);
  const [datava, setdatava] = useState('');
  const [jid, setjid] = useState(0);
  const [datajid, setdatajid] = useState('');
  const [jie, setjie] = useState(0);
  const [datajie, setdatajie] = useState('');
  const [subcld, setsubcld] = useState(0);
  const [datasubcld, setdatasubcld] = useState('');
  const [subcle, setsubcle] = useState(0);
  const [datasubcle, setdatasubcle] = useState('');
  const [piard, setpiard] = useState(0);
  const [datapiard, setdatapiard] = useState('');
  const [piare, setpiare] = useState(0);
  const [datapiare, setdatapiare] = useState('');
  const [vfemd, setvfemd] = useState(0);
  const [datavfemd, setdatavfemd] = useState('');
  const [vfeme, setvfeme] = useState(0);
  const [datavfeme, setdatavfeme] = useState('');
  const [afemd, setafemd] = useState(0);
  const [dataafemd, setdataafemd] = useState('');
  const [afeme, setafeme] = useState(0);
  const [dataafeme, setdataafeme] = useState('');
  const [piapedd, setpiapedd] = useState(0);
  const [datapiapedd, setdatapiapedd] = useState('');
  const [piapede, setpiapede] = useState(0);
  const [datapiapede, setdatapiapede] = useState('');
  const [svd, setsvd] = useState(0);
  const [datasvd, setdatasvd] = useState('');
  const [torax, settorax] = useState(0);
  const [datatorax, setdatatorax] = useState('');
  const [abd, setabd] = useState(0);
  const [dataabd, setdataabd] = useState('');

  // carregando o registro de invasões.
  const [listinvasoes, setlistinvasoes] = useState([]);
  const loadInvasoes = () => {
    axios.get(htmlghapinvasoes + idatendimento).then((response) => {
      var x = [0, 1];
      x = response.data;
      setlistinvasoes(x.rows);
      console.log('INVASÕES ATIVAS: ' + x.length);
    });
  }

  // LISTA DE DISPOSITIVOS:
  const [dispositivo, setdispositivo] = useState('');
  const arraydispositivossnc = ['PVC', 'PIC', 'DVE'];
  const arraydispositivosva = ['CN', 'MF', 'TOT', 'TQT'];
  const arraydispositivosvasc = ['CVC', 'CDL', 'CAT']; // CAT = permcath, intracath, outros cateteres incomuns.
  const arraydispositivospia = ['PIA'];
  const arraydispositivosuro = ['SVD', 'SVD3']; // SVD3 = svd de três vias.
  const arraydispositivostorax = ['DRN', 'MCP']; // MAP = marcapasso epicárdico.
  const arraydispositivosabd = ['DRN', 'PEN']; // DRN = dreno, PEN = penrose.

  /* 
  LOCALIZAÇÕES PARA DISPOSITIVOS:
  SNC, 
  VA, 
  JID, JIE, SUBCLD, SUBCLE, VFEMD, VFEME, 
  ARD, ARE, AFEMD, AFEME, APD, APE
  TORAXD, TORAXE, TORAXMED,
  ABD1, ABD2, ABD3, 
  URO
  */
  const [localdispositivo, setlocaldispositivo] = useState('');

  const updateInvasoes = (dispositivo) => {
    let getinvasao = [];
    getinvasao = listinvasoes.filter(item => item.local == localdispositivo && item.datatermino == null);
    setTimeout(() => {
      var idinvasao = getinvasao.map(item => item.id);
      var datainicioinvasao = getinvasao.map(item => item.datainicio);
      var dispositivoinvasao = getinvasao.map(item => item.dispositivo).toString(); // dispositivo que será modificado...
      if (getinvasao.length > 0) {
        // atualizar a invasão.
        var obj = {
          idpct: idpaciente,
          idatendimento: idatendimento,
          dispositivo: dispositivoinvasao, // dispositivo que será modificado!
          local: localdispositivo,
          datainicio: datainicioinvasao,
          datatermino: moment(),
          idprofissional: 0
        };
        axios.post(htmlghapupdateinvasao + idinvasao, obj).then(() => {
          // inserir a invasão "atualizada".
          var obj = {
            idpct: idpaciente,
            idatendimento: idatendimento,
            dispositivo: dispositivo, // novo dispositivo!
            local: localdispositivo,
            datainicio: moment(),
            datatermino: null,
            idprofissional: 0
          };
          axios.post(htmlghapinsertinvasao, obj).then(() => {
            loadInvasoes();
          });
        });

      } else {
        // inserir uma invasão.
        var obj = {
          idpct: idpaciente,
          idatendimento: idatendimento,
          dispositivo: dispositivo,
          local: localdispositivo,
          datainicio: moment(),
          datatermino: null,
          idprofissional: 0
        };
        axios.post(htmlghapinsertinvasao, obj).then(() => {
          loadInvasoes();
        });
      }
    }, 1000);
  };

  // estados relacionados aos parâmetros ventilatórios.
  const [idvm, setidvm] = useState('');
  const [modo, setmodo] = useState('');
  const [pressao, setpressao] = useState('');
  const [volume, setvolume] = useState('');
  const [peep, setpeep] = useState('');
  const [fi, setfi] = useState('');
  // carregando o último registro de parâmetros ventilatórios.
  const loadVm = () => {
    // ROTA: SELECT * FROM ventilacao WHERE idatendimento = idatendimento.
    axios.get(html + "/getvm/'" + idatendimento + "'").then((response) => {
      var x = [0, 1];
      x = response.data;
      if (x.length > 0) {
        setidvm(x.map((item) => item.id));
        setmodo(x.map((item) => item.modo));
        setpressao(x.map((item) => item.pressao));
        setvolume(x.map((item) => item.volume));
        setpeep(x.map((item) => item.peep));
        setfi(x.map((item) => item.fi));
      } else {
        // criando o registro de parâmetros ventilatórios para o atendimento. 
        insertVm();
        setTimeout(() => {
          loadVm();
        }, 1000);
      }
    });
  }
  // atualizando os parâmetros ventilatórios.
  const updateVm = () => {
    setpressao(document.getElementById("inputPp").value);
    setpeep(document.getElementById("inputPeep").value);
    setfi(document.getElementById("inputFi").value);
    var obj = {
      idatendimento: idatendimento,
      modo: modo,
      pressao: document.getElementById("inputPp").value,
      volume: '',
      peep: document.getElementById("inputPeep").value,
      fi: document.getElementById("inputFi").value,
    };
    axios.post(html + '/updatevm/' + idvm, obj);
    setvmclass('secondary fade-in');
    setviewupdatevm(0);
  };
  // criando o registro de parâmetros ventilatórios para o atendimento.
  const insertVm = () => {
    var obj = {
      idatendimento: idatendimento,
      modo: '',
      pressao: 16,
      volume: 400,
      peep: 8,
      fi: 100,
    };
    axios.post(html + '/insertvm', obj);
  };
  // exibição dos parâmetros ventilatórios.
  function CardVm() {
    return (
      <div id="cardvm"
        onClick={() => document.getElementById("cardvm").classList.toggle("pulsewidgetscrollmax")}
        className="pulsewidgetscroll"
        style={{
          overflowY: 'hidden', flexDirection: 'column', justifyContent: 'center',
          alignItems: 'center', backgroundColor: 'darkgrey', borderColor: 'darkgrey'
        }}
      >
        <div className="pulsewidgettitle">
          <div className="title5">VENTILAÇÃO MECÂNICA</div>
        </div>
        <div className="pulsewidgetcontent"
          title="PARÂMETROS VENTILATÓRIOS."
          style={{
            opacity: 1,
            display: modo == '' || va > 2 ? 'none' : '',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%',
          }}>
          <div className="title4" onClick={() => setviewupdatevm(1)}>
            {'PARÂMETROS VENTILATÓRIOS:'}
          </div>
          <div onClick={() => setviewupdatevm(1)} className="title2center">{'MODO: ' + modo}</div>
          <div onClick={() => setviewupdatevm(1)} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <div className={parseInt(pressao) > 14 ? 'title3' : 'title2center'} style={{ alignSelf: 'center', textAlign: 'center' }}>
              {modo === 'PCV' || 'PSV' ? 'PI: ' + pressao + ' cmH2O' : 'VCV: ' + pressao + 'ml'}
            </div>
            <div className={parseInt(peep) > 10 ? 'title3' : 'title2center'} style={{ alignSelf: 'center' }}>{'PEEP: ' + peep + ' cmH2O'}</div>
            <div className={parseInt(fi) > 60 ? 'title3' : 'title2center'} style={{ alignSelf: 'center' }}>{'FI: ' + fi + '%'}</div>
          </div>
        </div>
        <div onClick={() => setviewupdatevm(1)} className="pulsewidgetcontent"
          title="PARÂMETROS VENTILATÓRIOS."
          style={{
            display: va > 2 ? '' : 'none',
            width: '100%', margin: 0, padding: 0,
            height: '100%',
          }}>
          <div className="title2center">
            {'PACIENTE FORA DA VM.'}
          </div>
        </div >
        <div className="pulsewidgetcontent"
          title="PARÂMETROS VENTILATÓRIOS."
          onClick={() => setviewupdatevm(1)}
          style={{
            display: modo == '' && va < 3 ? '' : 'none',
            width: '100%', margin: 0, padding: 0,
            height: '100%',
          }}>
          <div className="title2center" style={{ width: window.innerWidth > 800 ? 280 : 140 }}>{'SEM REGISTRO DE PARÂMETROS VENTILATÓRIOS'}</div>
        </div>
      </div >
    );
  }
  // componente para atualização dos parâmetros ventilatórios.
  const [viewupdatevm, setviewupdatevm] = useState(0);
  const [vmclass, setvmclass] = useState("secondary");
  function UpdateVm() {
    if (viewupdatevm === 1) {
      return (
        <div
          className="menucover"
          onClick={(e) => { setviewupdatevm(0); e.stopPropagation() }}
          style={{
            zIndex: 9, display: 'flex', flexDirection: 'column',
            justifyContent: 'center', alignItems: 'center'
          }}>
          <div className="menucontainer">
            <div id="cabeçalho" className="cabecalho">
              <div>{'ATUALIZAR PARÂMETROS DA VM'}</div>
              <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <button className="red-button" onClick={() => setviewupdatevm(0)}>
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
                  onClick={() => updateVm()}
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
            <div className="corpo" onClick={(e) => e.stopPropagation()}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  borderRadius: 5,
                  marginTop: 5,
                  marginBottom: 0,
                }}
              >
                <label className="title2center">MODO VENTILATÓRIO:</label>
                <div
                  style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
                >
                  <button
                    className={modo == 'PCV' ? "red-button" : "blue-button"}
                    style={{
                      width: window.innerWidth > 800 ? 130 : 70,
                      padding: 10,
                    }}
                    onClick={() => clickPCV()}
                  >
                    PCV
                  </button>
                  <button
                    className={modo == 'PSV' ? "red-button" : "blue-button"}
                    style={{
                      width: window.innerWidth > 800 ? 130 : 70,
                      padding: 10,
                    }}
                    onClick={() => clickPSV()}
                  >
                    PSV
                  </button>
                  <button
                    className={modo == 'VCV' ? "red-button" : "blue-button"}
                    style={{
                      width: window.innerWidth > 800 ? 130 : 70,
                      padding: 10,
                    }}
                    onClick={() => clickVCV()}
                  >
                    VCV
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <label className="title2center">
                    {modo === 'PCV' ? 'PCV:' : modo === 'PSV' ? 'PSV:' : 'VT:'}
                  </label>
                  <input
                    autoComplete="off"
                    className="input"
                    placeholder={modo === 'PCV' ? 'PCV' : modo === 'PSV' ? 'PSV' : 'VT'}
                    onFocus={(e) => (e.target.placeholder = '')}
                    onBlur={(e) => (e.target.placeholder = 'PC.')}
                    onChange={(e) => validatePp(e.target.value)}
                    title={modo === 'PCV' ? 'PCV(cmH2O)' : modo === 'PSV' ? 'PSV(cmH2O)' : 'VT(ml)'}
                    style={{
                      width: 100,
                      height: 50,
                    }}
                    maxLength={modo === 'VCV' ? 3 : 2}
                    id="inputPp"
                    defaultValue={pressao}
                  ></input>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <label className="title2center">PEEP:</label>
                  <input
                    autoComplete="off"
                    className="input"
                    placeholder="PEEP."
                    onFocus={(e) => (e.target.placeholder = '')}
                    onBlur={(e) => (e.target.placeholder = 'PEEP.')}
                    onChange={() => fixPeep()}
                    defaultValue={peep}
                    title="PEEP (cmH20)."
                    style={{
                      width: 100,
                      height: 50,
                    }}
                    min={0}
                    max={50}
                    id="inputPeep"
                  ></input>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <label className="title2center">FI:</label>
                  <input
                    autoComplete="off"
                    className="input"
                    placeholder="FI."
                    onFocus={(e) => (e.target.placeholder = '')}
                    onBlur={(e) => (e.target.placeholder = 'FI.')}
                    onChange={() => fixFi()}
                    defaultValue={fi}
                    title="FI (%)."
                    style={{
                      width: 100,
                      height: 50,
                    }}
                    min={0}
                    max={100}
                    id="inputFi"
                  ></input>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return null;
    }
  }

  // escolha do modo ventilatorio.
  const clickPCV = () => {
    setmodo('PCV');
    setvmclass('secondary');
  };
  const clickVCV = () => {
    setmodo('VCV');
    setvmclass('secondary');
  };
  const clickPSV = () => {
    setmodo('PSV');
    setvmclass('secondary');
  };
  // tratamentos dos inputs para Peep e Fi.
  const fixPeep = () => {
    var y = '';
    y = document.getElementById('inputPeep').value;
    if (y.length > 2) {
      document.getElementById('inputPeep').value = '';
    }
  };
  const fixFi = () => {
    var z = ''; // definindo x como string, para que a propriedade lenght funcione.
    z = document.getElementById('inputFi').value;
    if (z.length > 3) {
      document.getElementById('inputFi').value = '';
    }
  };
  // validando entradas para campos numéricos.
  const validatePp = (txt) => {
    var last = txt.slice(-1);
    if (isNaN(last) === true) {
      last = '';
      document.getElementById('inputPp').value = '';
    } else {
    }
  };

  // estados relacionados à evolução.
  const [dataevolucao, setdataevolucao] = useState('');
  const [evolucao, setevolucao] = useState('');
  const [pas, setpas] = useState('');
  const [pad, setpad] = useState('');
  const [fc, setfc] = useState('');
  const [fr, setfr] = useState('');
  const [sao2, setsao2] = useState('');
  const [tax, settax] = useState('');
  const [diu, setdiu] = useState('');
  const [fezes, setfezes] = useState('');
  const [bh, setbh] = useState('');
  const [acv, setacv] = useState('');
  const [ar, setar] = useState('');
  const [abdome, setabdome] = useState('');
  const [outros, setoutros] = useState('');
  const [glasgow, setglasgow] = useState('');
  const [rass, setrass] = useState('');
  const [ramsay, setramsay] = useState('');
  const [hd, sethd] = useState(0);
  const [uf, setuf] = useState(0);
  const [heparina, setheparina] = useState(0);
  const [braden, setbraden] = useState(0);
  const [morse, setmorse] = useState(0);
  // carregando o último registro de evolução + exame clínico referente ao atendimento.
  const loadLastevolucao = (idatendimento, idpaciente) => {
    var y = [0, 1];
    if (tipounidade != 4) {
      axios.get(html + "/evolucoes").then((response) => {
        y = response.data;
        var x = [];
        var x = y.filter(item => item.idpaciente == idpaciente).sort(((a, b) => a.id > b.id ? 1 : -1)).slice(-1);
        setdataevolucao(x.map(item => item.data));
        setevolucao(x.map(item => item.evolucao));
        setpas(x.map(item => item.pas));
        setpad(x.map(item => item.pad));
        setfc(x.map(item => item.fc));
        setfr(x.map(item => item.fr));
        setsao2(x.map(item => item.sao2));
        settax(x.map(item => item.tax));
        setdiu(x.map(item => item.diu));
        setbh(x.map(item => item.bh));
        setacv(x.map(item => item.acv));
        setar(x.map(item => item.ar));
        setabdome(x.map(item => item.abdome));
        setoutros(x.map(item => item.outros));
        setglasgow(x.map(item => item.glasgow));
        setrass(x.map(item => item.rass));
        setramsay(x.map(item => item.ramsay));
      });
    } else {
      axios.get(html + "/evolucoes").then((response) => {
        var x = [0, 1];
        y = response.data;
        x = y.filter((item) => item.idpaciente == idpaciente).sort(((a, b) => a.id > b.id ? 1 : -1)).slice(-1);
        setdataevolucao(x.map((item) => item.data));
        setevolucao(x.map((item) => item.evolucao));
        setpas(x.map((item) => item.pas));
        setpad(x.map((item) => item.pad));
        setfc(x.map((item) => item.fc));
        setfr(x.map((item) => item.fr));
        setsao2(x.map((item) => item.sao2));
        settax(x.map((item) => item.tax));
        setdiu(x.map((item) => item.diu));
        setbh(x.map((item) => item.bh));
        setacv(x.map((item) => item.acv));
        setar(x.map((item) => item.ar));
        setabdome(x.map((item) => item.abdome));
        setoutros(x.map((item) => item.outros));
        setglasgow(x.map((item) => item.glasgow));
        setrass(x.map((item) => item.rass));
        setramsay(x.map((item) => item.ramsay));
      });
    }
    // carregando os alertas (primeiro carregamento).
  }

  // carregando os últimos registros de evolução + exame clínico que apresentam valores válidos de BRADEN E MORSE.
  const [lastbraden, setlastbraden] = useState(0);
  const [databraden, setdatabraden] = useState();
  const loadLastBraden = () => {
    axios.get(html + "/lastbraden/'" + idatendimento + "'").then((response) => {
      var x = [0, 1];
      x = response.data;
      setlastbraden(x.map((item) => item.braden));
      setdatabraden(x.map((item) => item.data));
    });
  }
  const [lastmorse, setlastmorse] = useState(0);
  const [datamorse, setdatamorse] = useState();
  const loadLastMorse = () => {
    axios.get(html + "/lastmorse/'" + idatendimento + "'").then((response) => {
      var x = [0, 1];
      x = response.data;
      setlastmorse(x.map((item) => item.morse));
      setdatamorse(x.map((item) => item.data));
    });
  }

  // EXIBIÇÃO DOS ALERTAS.
  const [alertas, setalertas] = useState([]);
  var arrayalertas = [];
  var escoresepse = 0;
  var pam = Math.ceil((parseInt(pas) + 2 * parseInt(pad)) / 3);
  const alertSepse = () => {
    if (tax > 37.8 || tax < 35) {
      escoresepse = escoresepse + 1;
    }
    if (fc > 90) {
      escoresepse = escoresepse + 1;
    }
    if (fr > 20) {
      escoresepse = escoresepse + 1;
    }
    if (glasgow < 15) {
      escoresepse = escoresepse + 2;
    }
    if (sao2 < 90) {
      escoresepse = escoresepse + 2;
    }
    if (diu < 1000) {
      escoresepse = escoresepse + 2;
    }
    if (pam < 70) {
      escoresepse = escoresepse + 2;
    }
    if (escoresepse > 1) {
      arrayalertas.push('CRITÉRIOS DE SEPSE!');
    }
  }
  const alertDadosVitais = () => {
    if (pam < 60) {
      arrayalertas.push('HIPOTENSÃO');
    }
    if (pam > 120) {
      arrayalertas.push('HIPERTENSÃO');
    }
    if (fc < 60) {
      arrayalertas.push('BRADICARDIA');
    }
    if (fc > 120) {
      arrayalertas.push('TAQUICARDIA');
    }
    if (fr < 15) {
      arrayalertas.push('BRADIPNÉIA');
    }
    if (fr > 22) {
      arrayalertas.push('TAQUIPNÉIA');
    }
    if (sao2 < 93) {
      arrayalertas.push('SAO2 BAIXA');
    }
    if (diurese12h < 1000) {
      arrayalertas.push('OLIGÚRIA');
    }
    if (diurese12h > 3000) {
      arrayalertas.push('POLIÚRIA');
    }
    if (ganhos12h - perdas12h < -2000) {
      arrayalertas.push('BALANÇO HÍDRICO MUITO NEGATIVO');
    }
    if (ganhos12h - perdas12h > 2000) {
      arrayalertas.push('BALANÇO HÍDRICO MUITO POSITIVO');
    }
    if (ganhosacumulados - perdasacumuladas < -3000) {
      arrayalertas.push('BALANÇO HÍDRICO ACUMULADO MUITO NEGATIVO');
    }
    if (ganhosacumulados - perdasacumuladas > 3000) {
      arrayalertas.push('BALANÇO HÍDRICO ACUMULADO MUITO POSITIVO');
    }
  }
  // busca por registros de evacuações em evoluções dos últimos 3 dias.
  const [fezesausentes, setfezesausentes] = useState(0);
  const [fezesnormais, setfezesnormais] = useState(0);
  const [fezesdiarreicas, setfezesdiarreicas] = useState(0);
  const alertEvacuacoes = () => {
    axios.get(html + "/fezesausentes/'" + idatendimento + "'").then((response) => {
      var x = [0, 1];
      x = response.data;
      setfezesausentes(x.length);
    });
    axios.get(html + "/fezesnormais/'" + idatendimento + "'").then((response) => {
      var x = [0, 1];
      x = response.data;
      setfezesnormais(x.length);
    });
    axios.get(html + "/fezesdiarreicas/'" + idatendimento + "'").then((response) => {
      var x = [0, 1];
      x = response.data;
      setfezesdiarreicas(x.length);
    });
    if (fezesnormais < 1 && fezesdiarreicas < 1 && fezesausentes > 0) {
      arrayalertas.push('EVACUAÇÕES AUSENTES NOS ÚLTIMOS 3 DIAS.');
    }
    if (fezesdiarreicas > fezesausentes && fezesdiarreicas > fezesnormais) {
      arrayalertas.push('EVACUAÇÕES DIARRÉICAS NOS ÚLTIMOS 3 DIAS.');
    }
  }
  // tempo prolongado de dispositivos e tot.
  const alertDispositivos = () => {
    if (va == 2 && moment().diff(moment(datava, 'DD/MM/YYYY'), 'days') > 10) {
      arrayalertas.push('TEMPO DE INTUBAÇÃO PROLONGADO: ' + moment().diff(moment(datava, 'DD/MM/YYYY'), 'days') + ' DIAS.')
    }
    if (jid !== 0 && moment().diff(moment(datajid, 'DD/MM/YYYY'), 'days') > 14) {
      arrayalertas.push('TEMPO PROLONGADO DE INVASÃO: CVC JUGULAR INTERNA DIREITA ' + moment().diff(moment(datajid, 'DD/MM/YYYY'), 'days') + ' DIAS.')
    }
    if (jie !== 0 && moment().diff(moment(datajie, 'DD/MM/YYYY'), 'days') > 14) {
      arrayalertas.push('TEMPO PROLONGADO DE INVASÃO: CVC JUGULAR INTERNA ESQUERDA ' + moment().diff(moment(datajie, 'DD/MM/YYYY'), 'days') + ' DIAS.')
    }
    if (subcld !== 0 && moment().diff(moment(datasubcld, 'DD/MM/YYYY'), 'days') > 14) {
      arrayalertas.push('TEMPO PROLONGADO DE INVASÃO: CVC SUBCLÁVIA DIREITA ' + moment().diff(moment(datasubcld, 'DD/MM/YYYY'), 'days') + ' DIAS.')
    }
    if (subcle !== 0 && moment().diff(moment(datasubcle, 'DD/MM/YYYY'), 'days') > 14) {
      arrayalertas.push('TEMPO PROLONGADO DE INVASÃO: CVC SUBCLÁVIA ESQUERDA ' + moment().diff(moment(datasubcle, 'DD/MM/YYYY'), 'days') + ' DIAS.')
    }
    if (piard !== 0 && moment().diff(moment(datapiard, 'DD/MM/YYYY'), 'days') > 14) {
      arrayalertas.push('TEMPO PROLONGADO DE INVASÃO: PIA RADIAL DIREITA ' + moment().diff(moment(datapiard, 'DD/MM/YYYY'), 'days') + ' DIAS.')
    }
    if (piare !== 0 && moment().diff(moment(datapiare, 'DD/MM/YYYY'), 'days') > 14) {
      arrayalertas.push('TEMPO PROLONGADO DE INVASÃO: PIA RADIAL ESQUERDA ' + moment().diff(moment(datapiare, 'DD/MM/YYYY'), 'days') + ' DIAS.')
    }
    if (vfemd !== 0 && moment().diff(moment(datavfemd, 'DD/MM/YYYY'), 'days') > 14) {
      arrayalertas.push('TEMPO PROLONGADO DE INVASÃO: CVC FEMORAL DIREITA ' + moment().diff(moment(datavfemd, 'DD/MM/YYYY'), 'days') + ' DIAS.')
    }
    if (vfeme !== 0 && moment().diff(moment(datavfeme, 'DD/MM/YYYY'), 'days') > 14) {
      arrayalertas.push('TEMPO PROLONGADO DE INVASÃO: CVC FEMORAL ESQUERDA ' + moment().diff(moment(datavfeme, 'DD/MM/YYYY'), 'days') + ' DIAS.')
    }
    if (afemd !== 0 && moment().diff(moment(dataafemd, 'DD/MM/YYYY'), 'days') > 14) {
      arrayalertas.push('TEMPO PROLONGADO DE INVASÃO: PIA FEMORAL DIREITA ' + moment().diff(moment(dataafemd, 'DD/MM/YYYY'), 'days') + ' DIAS.')
    }
    if (afeme !== 0 && moment().diff(moment(dataafeme, 'DD/MM/YYYY'), 'days') > 14) {
      arrayalertas.push('TEMPO PROLONGADO DE INVASÃO: PIA FEMORAL ESQUERDA ' + moment().diff(moment(dataafeme, 'DD/MM/YYYY'), 'days') + ' DIAS.')
    }
    if (piapedd !== 0 && moment().diff(moment(datapiapedd, 'DD/MM/YYYY'), 'days') > 14) {
      arrayalertas.push('TEMPO PROLONGADO DE INVASÃO: PIA PEDIOSA DIREITA ' + moment().diff(moment(datapiapedd, 'DD/MM/YYYY'), 'days') + ' DIAS.')
    }
    if (piapede !== 0 && moment().diff(moment(datapiapede, 'DD/MM/YYYY'), 'days') > 14) {
      arrayalertas.push('TEMPO PROLONGADO DE INVASÃO: PIA PEDIOSA ESQUERDA ' + moment().diff(moment(datapiapede, 'DD/MM/YYYY'), 'days') + ' DIAS.')
    }
    if (torax !== 0 && moment().diff(moment(datatorax, 'DD/MM/YYYY'), 'days') > 14) {
      arrayalertas.push('TEMPO PROLONGADO DE INVASÃO: DRENO TORÁCICO ' + moment().diff(moment(datatorax, 'DD/MM/YYYY'), 'days') + ' DIAS.')
    }
    if (abd !== 0 && moment().diff(moment(dataabd, 'DD/MM/YYYY'), 'days') > 14) {
      arrayalertas.push('TEMPO PROLONGADO DE INVASÃO: DRENO ABDOMINAL ' + moment().diff(moment(dataabd, 'DD/MM/YYYY'), 'days') + ' DIAS.')
    }
    if (snc !== 0 && moment().diff(moment(datasnc, 'DD/MM/YYYY'), 'days') > 14) {
      arrayalertas.push('TEMPO PROLONGADO DE INVASÃO: DISPOSITIVO SNC ' + moment().diff(moment(datasnc, 'DD/MM/YYYY'), 'days') + ' DIAS.')
    }
  }

  // alerta de culturas em aberto.
  const alertCulturas = () => {
    axios.get(html + "/culturaspendentes/'" + idatendimento + "'").then((response) => {
      var x = [0, 1];
      x = response.data;
      if (x.lenght > 0) {
        arrayalertas.push('RESULTADOS DE CULTURA PENDENTES.')
      }
    });
  }

  // carregando listas das telas secundárias.
  // LISTA DE DIAGNÓSTICOS.
  // constantes relacionadas à lista de diagnósticos:
  const [iddiagnostico, setiddiagnostico] = useState(0);
  const [cid, setcid] = useState('');
  const [diagnostico, setdiagnostico] = useState('');
  const [iniciodiag, setiniciodiag] = useState('');
  const [terminodiag, setterminodiag] = useState('');

  const selectDiagnostico = (item) => {
    setiddiagnostico(item.id);
    setcid(item.cid);
    setdiagnostico(item.descricao);
    setiniciodiag(item.datainicio);
    setterminodiag(item.datatermino);
    window.scrollTo(0, 0);
    viewDiagnostico(2);
  }

  // excluir um diagnóstico da lista.
  const deleteDiagnostico = (item) => {
    axios.get(html + "/deletediagnostico/'" + item.id + "'").then(() => {
      toast(1, '#52be80', 'DIAGNÓSTICO CANCELADO COM SUCESSO.', 3000);
      // loadDiagnosticos(idpaciente);
    });
  }

  // renderizando a tela INSERIR OU ATUALIZAR DIAGNÓSTICO.
  const [viewdiagnostico, setviewdiagnostico] = useState(0);
  const viewDiagnostico = (valor) => {
    setviewdiagnostico(0);
    setTimeout(() => {
      setviewdiagnostico(valor); // 1 para inserir diagnostico, 2 para atualizar diagnostico.
    }, 500);
  }

  // exibição da lista de internações e atendimentos (tela principal).
  function CardInternacoes() {
    return (
      <div
        className="pulsewidgetscroll"
        title="INTERNAÇÕES"
        style={{ display: cardhistoricoatendimentos == 1 ? 'flex' : 'none', }}
        id="cardatendimentos"
        onClick={() => document.getElementById("cardatendimentos").classList.toggle("pulsewidgetscrollmax")}
      >
        <div className="title4 pulsewidgettitle">{window.innerWidth > 400 ? 'HISTÓRICO DE ATENDIMENTOS' : 'ATEND.'}</div>
        <div className="pulsewidgetcontent" style={{ display: listatendimentos.length > 0 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'flex-start' }}>
          {listatendimentos.filter(value => value.idpaciente == idpaciente).map((item) => (
            <div
              key={item.id}
              className="title2center"
            >
              {JSON.stringify(item.admissao).substring(1, 11) + ' - ' + item.hospital + ' / ' + item.unidade}
            </div>
          ))}
        </div>
        <div className="pulsewidgetcontent" style={{ display: listatendimentos.length < 1 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center' }}>
          <text style={{ color: '#ffffff' }}>SEM ATENDIMENTOS REGISTRADOS</text>
        </div>
      </div>
    );
  }

  // filtro para os diagnósticos.
  function ShowFilterDiagnosticos() {
    if (stateprontuario === 3) {
      return (
        <div style={{ display: 'flex', flexDirection: 'row', margin: 5 }}>
          <input
            className="input"
            autoComplete="off"
            placeholder="BUSCAR DIAGNÓSTICO..."
            onFocus={(e) => (e.target.placeholder = '')}
            onBlur={(e) => (e.target.placeholder = 'BUSCAR DIAGNÓSTICO...')}
            onKeyUp={() => filterDiagnostico()}
            onClick={window.innerWidth < 400 ? (e) => {
              document.getElementById("identificação").style.display = "none";
              document.getElementById("inputFilterDiagnostico").focus();
              e.stopPropagation();
            }
              : null
            }
            style={{
              width: '100%',
              margin: 0,
            }}
            type="text"
            id="inputFilterDiagnostico"
            defaultValue={filterdiagnostico}
            maxLength={100}
          ></input>
        </div >
      )
    } else {
      return null;
    }
  }

  const [filterdiagnostico, setfilterdiagnostico] = useState('');
  var searchdiagnostico = '';
  var timeout = null;

  const filterDiagnostico = () => {
    clearTimeout(timeout);
    document.getElementById("inputFilterDiagnostico").focus();
    searchdiagnostico = document.getElementById("inputFilterDiagnostico").value.toUpperCase();
    timeout = setTimeout(() => {
      if (searchdiagnostico === '') {
        setarraydiagnosticos(listdiagnosticos);
        document.getElementById("inputFilterDiagnostico").value = '';
        document.getElementById("inputFilterDiagnostico").focus();
      } else {
        setarraydiagnosticos(listdiagnosticos.filter(item => JSON.stringify(item.descricao).toUpperCase().includes(searchdiagnostico.toUpperCase())));
        // setfilterdiagnostico(document.getElementById("inputFilterDiagnostico").value.toUpperCase());
        // setarraydiagnosticos(listdiagnosticos.filter(item => JSON.stringify(item.descricao).includes(searchdiagnostico) == true));
        document.getElementById("inputFilterDiagnostico").value = searchdiagnostico;
        document.getElementById("inputFilterDiagnostico").focus();
      }
      if (window.innerWidth < 400) {
        document.getElementById("identificação").style.display = "none";
        document.getElementById("inputFilterDiagnostico").focus();
      }
    }, 1000);
  }

  // exibição da lista de diagnósticos (habilitando crud).
  const ShowDiagnosticos = useCallback(() => {
    if (stateprontuario === 3) {
      return (
        <div
          id="diagnósticos"
          className="conteudo"
          onClick={() => { document.getElementById("identificação").style.display = "flex"; document.getElementById("inputFilterDiagnostico").value = ""; setarraydiagnosticos(listdiagnosticos) }}
        >
          <Filtros></Filtros>
          <div
            className="scroll"
            style={{ width: '100%', height: '90%', backgroundColor: 'transparent', borderColor: 'transparent' }}
            id="LISTA DE DIAGNÓSTICOS"
          >
            {arraydiagnosticos.map((item) => (
              <div
                key={item.id}
                id="item da lista"
                className="row"
                style={{ opacity: item.datatermino == null ? 1 : 0.5 }}
              >
                <div style={{
                  display: 'flex', flexDirection: 'column', justifyContent: 'center',
                  width: '100%'
                }}>
                  <div id="data do diagnóstico e botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <button
                      className="green-button"
                      style={{
                        padding: 10,
                        flexDirection: 'column',
                        backgroundColor: '#52be80'
                      }}
                    >
                      {moment(item.datainicio).format('DD/MM/YY')}
                    </button>
                    <div style={{ display: item.datatermino == null ? 'flex' : 'none', flexDirection: 'row', justifyContent: 'center' }}>
                      <button
                        id={"deletekey 0 " + item.id}
                        className="animated-red-button"
                        onClick={(e) => { deletetoast(updateDiagnosticoGhap, item); e.stopPropagation() }}
                      >
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
                      <button
                        id={"deletekey 1 " + item.id}
                        style={{ display: 'none', width: 100 }}
                        className="animated-red-button"
                        onClick={(e) => { deletetoast(updateDiagnosticoGhap, item); e.stopPropagation() }}
                      >
                        <div>DESFAZER</div>
                        <div className="deletetoast"
                          style={{
                            height: 5, borderRadius: 5, backgroundColor: 'pink', alignSelf: 'flex-start',
                            marginLeft: 5, marginRight: 5, maxWidth: 90,
                          }}>
                        </div>
                      </button>
                    </div>
                  </div>
                  <div id="cid e diagnóstico"
                    style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '100%' }}>
                    <div className="title2" style={{ justifyContent: 'flex-start', marginBottom: 0 }}>
                      {item.cid + ' - ' + item.descricao.toString().toUpperCase()}
                    </div>
                    <div className="title2" style={{ opacity: 0.5, justifyContent: 'flex-start', marginTop: 0 }}>
                      {"REGISTRADO POR " + item.idprofissional + '.'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
              <button className="blue-button"
                onClick={() => viewDiagnostico(1)}
                style={{ display: window.innerWidth > 800 ? 'none' : 'flex', marginRight: 5, marginTop: 5 }}
              >
                <img
                  alt=""
                  src={novo}
                  style={{
                    margin: 10,
                    height: 30,
                    width: 30,
                  }}
                ></img>
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }, [stateprontuario, arraydiagnosticos]
  );

  // PAINEL DE ALERTAS.
  function CardAlertas() {
    return (
      <div id="cardalertas"
        className="pulsewidgetscroll"
        onClick={() => document.getElementById("cardalertas").classList.toggle("pulsewidgetscrollmax")}
        style={{
          display: cardalertas == 1 ? 'flex' : 'none',
          backgroundColor: alertas.length > 1 ? '#ec7063' : '#52be80',
          borderColor: alertas.length > 1 ? '#ec7063' : '#52be80',
        }}
      >
        <div className="title5 pulsewidgettitle" style={{ color: '#ffffff' }}>
          {'ALERTAS: ' + alertas.length}
        </div>
        <div className="pulsewidgetcontent" style={{ color: '#ffffff' }}>
          {'SEM ALERTAS!'}
        </div>
        <div
          className="pulsewidgetcontent"
          id="ALERTAS"
          title="ALERTAS"
          style={{
            display: alertas.length > 0 ? 'flex' : 'none', justifyContent: 'flex-start',
          }}
        >
          {alertas.map((item) => (
            <div
              className="title2center"
              style={{
                margin: 0,
                marginTop: 2.5,
                marginBottom: 5,
                marginRight: 5,
                opacity: 1.0,
                color: '#ffffff'
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // LISTA DE PROBLEMAS.
  const loadProblemas = () => {
    axios.get(html + "/problemas").then((response) => {
      var x = [0, 1];
      x = response.data;
      setlistproblemas(x.sort((a, b) => moment(a.inicio, 'DD/MM/YYYY') < moment(b.inicio, 'DD/MM/YYYY') ? 1 : -1).filter(item => item.idatendimento == idatendimento));
      setarrayproblemas(x.sort((a, b) => moment(a.inicio, 'DD/MM/YYYY') < moment(b.inicio, 'DD/MM/YYYY') ? 1 : -1).filter(item => item.idatendimento == idatendimento));
    });
  }
  // constantes relacionadas à lista de problemas:
  const [idproblema, setidproblema] = useState(0);
  const [problema, setproblema] = useState('');
  const [inicioproblema, setinicioproblema] = useState('');

  const selectProblema = (item) => {
    setidproblema(item.id);
    setinicioproblema(item.inicio);
    setproblema(item.problema);
    window.scrollTo(0, 0);
    viewProblema(2);
  }

  // excluir um diagnóstico da lista.
  const deleteProblema = (item) => {
    axios.get(html + "/deleteproblema/'" + item.id + "'").then(() => {
      // toast(1, '#52be80', 'PROBLEMA EXLCUÍDO COM SUCESSO.', 3000);
      loadProblemas();
    });
  }

  const updateProblema = (item) => {
    var obj = {
      inicio: item.inicio,
      idatendimento: item.idatendimento,
      problema: item.problema,
      status: item.status == 1 ? 2 : 1,
      usuario: nomeusuario,
      registro: moment().format('DD/MM/YYYY') + ' ÀS ' + moment().format('HH:mm')
    };
    axios.post(html + '/updateproblema/' + item.id, obj).then(() => {
      toast(1, '#52be80', 'PROBLEMA ATUALIZADO COM SUCESSO.', 3000);
      loadProblemas();
    });
  }

  // filtro para a lista de problemas.
  function ShowFilterProblemas() {
    if (stateprontuario === 12) {
      return (
        <div style={{ display: 'flex', flexDirection: 'row', margin: 5 }}>
          <input
            className="input"
            autoComplete="off"
            placeholder="BUSCAR PROBLEMA..."
            onFocus={(e) => (e.target.placeholder = '')}
            onBlur={(e) => (e.target.placeholder = 'BUSCAR PROBLEMA...')}
            onChange={() => filterProblema()}
            style={{
              width: '100%',
              margin: 0,
            }}
            type="text"
            id="inputFilterProblema"
            defaultValue={filterproblema}
            maxLength={100}
          ></input>
        </div >
      )
    } else {
      return null;
    }
  }

  const [filterproblema, setfilterproblema] = useState('');
  var searchproblema = '';
  var timeout = null;

  const filterProblema = () => {
    clearTimeout(timeout);
    document.getElementById("inputFilterProblema").focus();
    searchproblema = document.getElementById("inputFilterProblema").value.toUpperCase();
    timeout = setTimeout(() => {
      if (searchproblema === '') {
        setarrayproblemas(listproblemas);
        document.getElementById("inputFilterProblema").value = '';
        document.getElementById("inputFilterProblema").focus();
      } else {
        setfilterproblema(document.getElementById("inputFilterProblema").value.toUpperCase());
        setarrayproblemas(listproblemas.filter(item => item.problema.includes(searchproblema) === true));
        document.getElementById("inputFilterProblema").value = searchproblema;
        document.getElementById("inputFilterProblema").focus();
      }
      if (window.innerWidth < 400) {
        document.getElementById("identificação").style.display = "none";
        document.getElementById("inputFilterProblema").focus();
      }
    }, 500);
  }

  // renderizando a tela INSERIR OU ATUALIZAR PROBLEMA.
  const [viewproblema, setviewproblema] = useState(0);
  const viewProblema = (valor) => {
    setviewproblema(0);
    setTimeout(() => {
      setviewproblema(valor); // 1 para inserir problema, 2 para atualizar problema.
    }, 500);
  }

  // exibição da lista de problemas (BASEADO NO SISTEMA DE PRONTUÁRIO ORIENTADO POR PROBLEMAS E EVIDÊNCIAS - POPE).
  const ShowProblemas = useCallback(() => {
    if (stateprontuario === 12) {
      return (
        <div
          id="problemas"
          className="conteudo"
        >
          <Filtros></Filtros>
          <div
            className="scroll"
            style={{ width: '100%', height: '90%', backgroundColor: 'transparent', borderColor: 'transparent' }}
            id="LISTA DE PROBLEMAS"
          >
            {arrayproblemas.map((item) => (
              <div
                key={item.id}
                id="item da lista"
                className="row"
              >
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '100%', padding: 0 }}>
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                      <div
                        id="status" className={item.status == 1 ? "red-button" : "green-button"}
                        style={{ padding: 10, width: 100 }}
                        onClick={() => updateProblema(item)}
                      >
                        {item.status == 1 ? 'ATIVO' : 'INATIVO'}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                      <button className="animated-yellow-button"
                        onClick={() => selectProblema(item)}
                      >
                        <img
                          alt=""
                          src={editar}
                          style={{
                            margin: 10,
                            height: 30,
                            width: 30,
                          }}
                        ></img>
                      </button>
                      <button
                        id={"deletekey 0 " + item.id}
                        className="animated-red-button"
                        onClick={(e) => { deletetoast(deleteProblema, item); e.stopPropagation() }}
                      >
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
                      <button
                        id={"deletekey 1 " + item.id}
                        style={{ display: 'none', width: 100 }}
                        className="animated-red-button"
                        onClick={(e) => { deletetoast(deleteProblema, item); e.stopPropagation() }}
                      >
                        <div>DESFAZER</div>
                        <div className="deletetoast"
                          style={{
                            height: 5, borderRadius: 5, backgroundColor: 'pink', alignSelf: 'flex-start',
                            marginLeft: 5, marginRight: 5, maxWidth: 90,
                          }}>
                        </div>
                      </button>
                    </div>
                  </div>
                  <div id="problema" className="title2" style={{ marginBottom: 0, justifyContent: 'left' }}>{item.inicio + ' - ' + item.problema}</div>
                  <div className="title2" style={{ marginTop: 0, justifyContent: 'left', opacity: 0.5 }}>
                    {'REGISTRADO POR ' + nomeusuario + ' EM ' + item.registro + '.'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    } else {
      return null;
    }
  }, [stateprontuario, arrayproblemas]
  );

  // filtros para seleção de profissionais (evoluções).
  const filterSelectorMed = () => {
    setarrayevolucao(listevolucoes.filter(item => item.funcao.includes("MED") === true));
    setfilterevolucao('');
    setidevolucao('');
  }
  const filterSelectorEnf = () => {
    setarrayevolucao(listevolucoes.filter(item => item.funcao.includes("ENF") === true));
    setfilterevolucao('');
    setidevolucao('');
  }

  // filtro para as evoluções.
  function ShowFilterEvolucao() {
    if (stateprontuario === 2) {
      return (
        <div style={{ display: 'flex', flexDirection: 'row', margin: 5 }}>
          <button
            onClick={() => filterSelectorMed()}
            className="blue-button"
            style={{
              maxHeight: 50,
              width: 70,
              margin: 0,
              marginRight: 5,
              padding: 10,
              textAlign: 'left',
            }}
          >
            MED
          </button>
          <button
            onClick={() => filterSelectorEnf()}
            className="blue-button"
            style={{
              maxHeight: 50,
              width: 70,
              margin: 0,
              marginRight: 5,
              padding: 10,
              textAlign: 'left',
            }}
          >
            ENF
          </button>
          <input
            className="input"
            autoComplete="off"
            placeholder="BUSCAR EVOLUÇÃO..."
            onFocus={(e) => { (e.target.placeholder = '') }}
            onBlur={(e) => (e.target.placeholder = 'BUSCAR EVOLUÇÃO...')}
            onChange={() => filterEvolucao()}
            onClick={window.innerWidth < 400 ? (e) => {
              document.getElementById("identificação").style.display = "none";
              document.getElementById("inputFilterEvolucao").focus();
              e.stopPropagation();
            }
              : null
            }
            style={{
              width: '100%',
              margin: 0,
            }}
            type="text"
            id="inputFilterEvolucao"
            defaultValue={filterevolucao}
            maxLength={100}
          ></input>
        </div >
      )
    } else {
      return null;
    }
  }

  //filtro das listas de evoluções.
  const [filterevolucao, setfilterevolucao] = useState('');
  var searchevolucao = '';
  var timeout = null;

  const filterEvolucao = () => {
    clearTimeout(timeout);
    document.getElementById("inputFilterEvolucao").focus();
    searchevolucao = document.getElementById("inputFilterEvolucao").value.toUpperCase();
    timeout = setTimeout(() => {
      if (searchevolucao === '') {
        setarrayevolucao(listevolucoes);
        // buceta
        document.getElementById("inputFilterEvolucao").value = '';
        document.getElementById("inputFilterEvolucao").focus();
      } else {
        setfilterevolucao(document.getElementById("inputFilterEvolucao").value.toUpperCase());
        setarrayevolucao(listevolucoes.filter(item => item.evolucao.includes(searchevolucao) === true));
        document.getElementById("inputFilterEvolucao").value = searchevolucao;
        document.getElementById("inputFilterEvolucao").focus();
      }
      if (window.innerWidth < 400) {
        document.getElementById("identificação").style.display = "none";
        document.getElementById("inputFilterEvolucao").focus();
      }
    }, 500);
  }

  // LISTA DE EVOLUÇÕES.
  const loadEvolucoesAntigas = (idpaciente) => {
    axios.get(html + "/evolucoes").then((response) => {
      var x = [0, 1];
      var y = [0, 1];
      x = response.data;
      y = x.filter((item) => item.idpaciente == idpaciente);
      setlistevolucoes(y.sort((a, b) => a.id < b.id ? 1 : -1));
      setarrayevolucao(y.sort((a, b) => a.id < b.id ? 1 : -1));
    });
  }

  // expandindo uma evolução para ver informações detalhadas.
  const [expandevolucao, setexpandevolucao] = useState(0);
  const expandEvolucao = (item) => {
    setidevolucao(item.id);
    if (expandevolucao === 0) {
      setexpandevolucao(1);
    } else {
      setexpandevolucao(0);
    }
  }

  // seleção de uma evolução médica para edição.
  const [idevolucao, setidevolucao] = useState(0);
  const editarEvolucao = (item) => {
    if (item.idusuario == idusuario) {
      window.scrollTo(0, 0);
      setidevolucao(item.id);
      setdataevolucao(item.data);
      setevolucao(item.evolucao);
      setpas(item.pas);
      setpad(item.pad);
      setfc(item.fc);
      setfr(item.fr);
      setsao2(item.sao2);
      settax(item.tax);
      setdiu(item.diu);
      setfezes(item.fezes);
      setbh(item.bh);
      setacv(item.acv);
      setar(item.ap);
      setabdome(item.abdome);
      setoutros(item.outros);
      setglasgow(item.glasgow);
      setrass(item.rass);
      setramsay(item.ramsay);
      sethd(item.hd);
      setuf(item.uf);
      setheparina(item.heparina);
      setbraden(item.braden);
      setmorse(item.morse);
      viewEvolucao(2);
      window.scrollTo(0, 0);
    } else {
      toast(1, '#ec7063', 'EDIÇÃO NÃO AUTORIZADA.', 3000);
    }
  }

  // excluindo o registro de evolução ainda não assinado.
  const deleteEvolucao = (item) => {
    if (item.idusuario == idusuario) {
      axios.get(html + "/deleteevolucao/'" + item.id + "'").then(() => {
        loadEvolucoesAntigas(idpaciente);
        // toast(1, '#52be80', 'EVOLUÇÃO CANCELADA COM SUCESSO.', 3000);
      });
    } else {
      toast(1, '#ec7063', 'EXCLUSÃO NÃO AUTORIZADA.', 3000);
    }
  }
  // assinando ou suspendendo uma evolução (conforme parâmetro).
  const updateEvolucao = (item, value) => {
    var obj = {
      idatendimento: idatendimento,
      data: item.data,
      evolucao: item.evolucao,
      pas: item.pas,
      pad: item.pad,
      fc: item.fc,
      fr: item.fr,
      sao2: item.sao2,
      tax: item.tax,
      diu: item.diu,
      fezes: item.fezes,
      bh: item.bh,
      acv: item.acv,
      ar: item.ar,
      abdome: item.abdome,
      outros: item.outros,
      glasgow: item.glasgow,
      rass: item.rass,
      ramsay: item.ramsay,
      uf: item.uf,
      heparina: item.heparina,
      braden: item.braden,
      morse: item.morse,
      status: value,
      idusuario: item.idusuario,
      funcao: item.funcao,
      usuario: item.usuario,
    };
    axios.post(html + '/updateevolucao/' + item.id, obj).then(() => {
      loadEvolucoesAntigas(idpaciente);
    });
  }

  // copiando uma evolução.
  const copiarEvolucao = (item) => {
    var obj = {
      idpaciente: item.idpaciente,
      idatendimento: item.idatendimento,
      data: moment().format('DD/MM/YY HH:mm'),
      evolucao: item.evolucao,
      pas: item.pas,
      pad: item.pad,
      fc: item.fc,
      fr: item.fr,
      sao2: item.sao2,
      tax: item.tax,
      diu: item.diu,
      fezes: item.fezes,
      bh: item.bh,
      acv: item.acv,
      ar: item.ar,
      abdome: item.abdome,
      outros: item.outros,
      glasgow: item.glasgow,
      rass: item.rass,
      ramsay: item.ramsay,
      uf: item.uf,
      heparina: item.heparina,
      braden: item.braden,
      morse: item.morse,
      status: 0,
      idusuario: item.idusuario,
      funcao: item.funcao,
      usuario: item.usuario,
    };
    axios.post(html + '/insertevolucao', obj);
    setTimeout(() => {
      loadEvolucoesAntigas(idpaciente);
    }, 1000);
  }

  // função que impede a assinatura de registros por outro profissional.
  const denied = () => {
    toast(1, '#ec7063', 'AÇÃO NÃO AUTORIZADA.', 3000);
  }

  // plano terapêutico.
  const ShowPlanoTerapeutico = useCallback(() => {
    if (stateprontuario === 21) {
      return (
        <div id="ivcf"
          className="conteudo" style={{ margin: 0, padding: 0 }}>
          <AptPlanoTerapeutico></AptPlanoTerapeutico>
        </div>
      )
    } else {
      return null;
    }
  }, [stateprontuario]);

  // renderização da lista de evoluções.
  var showexamefisico = 0;
  const ShowEvolucoes = useCallback(() => {
    if (stateprontuario === 2) {
      return (
        <div id="evoluções"
          className="conteudo"
          onClick={() => { document.getElementById("identificação").style.display = "flex"; document.getElementById("inputFilterEvolucao").value = ""; setarrayevolucao(listevolucoes) }}
        >
          <Filtros></Filtros>
          <div
            className="scroll"
            style={{ width: '100%', backgroundColor: 'transparent', borderColor: 'transparent' }}
            id="LISTA DE EVOLUÇÕES"
          >
            {arrayevolucao.map((item) => (
              <div
                key={item.id}
                id="item da lista"
                className="row rowbutton"
              >
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
                  <div id="tag do profissional"
                    className="blue-button"
                    style={{
                      position: 'relative',
                      width: 150,
                      minHeight: 150,
                      margin: 0,
                      padding: 10,
                      // flexDirection: 'column',
                      // justifyContent: 'flex-start',
                      // definindo a cor da tag de evolução, conforme a função do usuário.
                      backgroundColor: item.ds_conselho == 'CRM' ? '#85C1E9' :
                        item.ds_conselho == 'COREN' ? '#7DCEA0' :
                          item.ds_conselho == 'CREFITO' ? '#AF7AC5' :
                            item.ds_conselho == 'CREFONO' ? '#5499C7' : '#B2BABB'
                    }}
                  >
                    <div style={{ position: 'sticky' }}>
                      <div style={{ margin: 5, marginBottom: 0, marginTop: 0 }}>{moment(item.dt_hr_pre_med).format('DD/MM/YY')}</div>
                      <div style={{ margin: 0 }}>{moment(item.dt_hr_pre_med).format('HH:MM')}</div>
                      <div style={{ margin: 5, marginTop: 0 }}>{JSON.stringify(item.nm_prestador).substring(1, 30).replace('"', '').split(" ").slice(0, 1)}</div>
                      <div>{item.ds_conselho}</div>
                      <div>{item.ds_codigo_conselho}</div>
                    </div>
                  </div>

                  <div
                    id="evolução"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      width: '100%',
                      height: '100%',
                      margin: 0,
                      marginLeft: 5,
                      padding: 0,
                    }}>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>

                      <div id="botões"
                        style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', width: '100%' }}
                      >
                        <button id="edit-button"
                          className="animated-yellow-button"
                          onClick={() => editarEvolucao(item)}
                          title="EDITAR EVOLUÇÃO."
                          style={{
                            display: item.status == 0 && item.idusuario == idusuario ? 'flex' : 'none',
                            marginTop: 0, marginBottom: window.innerWidth < 800 ? 2.5 : 0,
                          }}>
                          <img
                            alt=""
                            src={editar}
                            style={{
                              margin: 10,
                              height: 30,
                              width: 30,
                            }}
                          ></img>
                        </button>
                        <button id="copy-button"
                          className="animated-green-button"
                          onClick={() => copiarEvolucao(item)}
                          title="COPIAR EVOLUÇÃO."
                          style={{
                            display: item.status == 1 && item.idusuario == idusuario ? 'flex' : 'none',
                            marginTop: 0,
                            marginBottom: window.innerWidth < 800 ? 5 : 0,
                            marginLeft: 5
                          }}
                        >
                          <img
                            alt=""
                            src={copiar}
                            style={{
                              margin: 10,
                              height: 30,
                              width: 30,
                            }}
                          ></img>
                        </button>
                        <button id="print-button"
                          className="animated-green-button"
                          onClick={() => viewPrintEvolucao(item)}
                          title="IMPRIMIR EVOLUÇÃO."
                          style={{
                            display: item.status == 1 && item.idusuario == idusuario ? 'flex' : 'none', marginTop: 0,
                            marginRight: 2.5,
                            marginLeft: 2.5,
                            marginBottom: window.innerWidth > 800 && item.idusuario == idusuario ? 0 : 5,
                          }}
                        >
                          <img
                            alt=""
                            src={imprimir}
                            style={{
                              margin: 10,
                              height: 30,
                              width: 30,
                            }}
                          ></img>
                        </button>
                        <button id="sign-button"
                          className="animated-green-button"
                          onClick={idusuario == item.idusuario ? () => updateEvolucao(item, 1) : () => null}
                          title="ASSINAR EVOLUÇÃO."
                          style={{
                            display: item.status == 0 && item.idusuario == idusuario ? 'flex' : 'none',
                            marginTop: 0, marginBottom: window.innerWidth < 800 ? 2.5 : 0
                          }}
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
                        <button
                          id={"deletekey 0 " + item.id}
                          className="animated-red-button"
                          onClick={(e) => { deletetoast(deleteEvolucao, item); e.stopPropagation() }}
                          title="EXCLUIR EVOLUÇÃO."
                          style={{
                            display: item.status == 0 && item.idusuario == idusuario ? 'flex' : 'none',
                            marginRight: 0,
                            marginLeft: 2.5,
                            marginBottom: 0,
                            marginTop: 0
                          }}
                        >
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
                        <button
                          id={"deletekey 1 " + item.id}
                          style={{
                            display: 'none', width: 100,
                            marginRight: 0,
                            marginLeft: 2.5,
                            marginBottom: 0,
                            marginTop: 0
                          }}
                          className="animated-red-button"
                          onClick={(e) => { deletetoast(deleteEvolucao, item); e.stopPropagation() }}
                        >
                          <div>DESFAZER</div>
                          <div className="deletetoast"
                            style={{
                              height: 5, borderRadius: 5, backgroundColor: 'pink', alignSelf: 'flex-start',
                              marginLeft: 5, marginRight: 5, maxWidth: 90,
                            }}>
                          </div>
                        </button>
                        <button id="suspend-button"
                          className="animated-red-button"
                          title="SUSPENDER EVOLUÇÃO."
                          onClick={idusuario == item.idusuario ? () => updateEvolucao(item, 2) : () => denied()}
                          style={{
                            display: item.status == 1 && item.idusuario == idusuario ? 'flex' : 'none',
                            marginRight: window.innerWidth > 800 ? 0 : 2.5,
                            marginTop: 0,
                            marginBottom: window.innerWidth < 800 ? 0 : 0,
                          }}
                        >
                          <img
                            alt=""
                            src={suspender}
                            style={{
                              margin: 10,
                              height: 30,
                              width: 30,
                            }}
                          ></img>
                        </button>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
                        <div
                          id="texto da evolução"
                          className="title2"
                          style={{ whiteSpace: 'pre-wrap', justifyContent: 'flex-start', textAlign: 'left', alignSelf: 'flex-start', width: '100%', height: '100%', minHeight: 60 }}>
                          {item.ds_evolucao.toString().replace(/\r/g, '\n').toUpperCase()}
                        </div>
                        <div
                          id="evolução - hd"
                          className="title3"
                          style={{
                            display: item.hd === 1 ? 'flex' : 'none',
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignSelf: 'flex-start',
                            marginTop: 0,
                            marginBottom: 10,
                          }}>
                          {'REALIZADA HD, UF ' + item.uf + 'ML.'}
                        </div>
                      </div>
                    </div>
                    <div
                      id="dados vitais"
                      className="hover-button"
                      style={{ margin: 0, justifyContent: 'flex-start', alignContent: 'flex-start' }}
                      onClick={() => {
                        if (showexamefisico == 0) {
                          showexamefisico = 1;
                          document.getElementById("exame físico" + item.id).style.display = "flex";
                        } else {
                          showexamefisico = 0;
                          document.getElementById("exame físico" + item.id).style.display = "none";
                        }
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', textAlign: 'center' }}>
                        <div style={{ display: window.innerWidth > 800 ? 'none' : 'none', flexDirection: 'row', justifyContent: 'center', margin: 5 }}>
                          {item.glasgow !== '' ? 'ECG: ' + item.glasgow : 'RASS: ' + item.rass !== '' ? 'RAMSAY ' + item.rass : item.ramsay}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', margin: 5 }}>
                          {'PAM: ' + Math.ceil((parseInt(item.pas) + 2 * parseInt(item.pad)) / 3)}
                        </div>
                        <div style={{ display: window.innerWidth > 800 ? 'flex' : 'none', flexDirection: 'row', justifyContent: 'center', margin: 5 }}>
                          {'FC: ' + item.fc}
                        </div>
                        <div style={{ display: window.innerWidth > 800 ? 'flex' : 'none', flexDirection: 'row', justifyContent: 'center', margin: 5 }}>
                          {'FR: ' + item.fr}
                        </div>
                        <div style={{ display: window.innerWidth > 800 ? 'flex' : 'none', flexDirection: 'row', justifyContent: 'center', margin: 5 }}>
                          {'SAO2: ' + item.sao2 + '%'}
                        </div>
                        <div style={{ display: window.innerWidth > 800 ? 'flex' : 'none', flexDirection: 'row', justifyContent: 'center', margin: 5 }}>
                          {'TAX: ' + item.tax}
                        </div>
                        <div style={{ display: window.innerWidth > 800 ? 'flex' : 'none', flexDirection: 'row', justifyContent: 'center', margin: 5 }}>
                          {'DIU: ' + item.diu}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', margin: 5 }}>
                          {'BH: ' + item.bh}
                        </div>
                      </div>
                    </div>
                    <div id={"exame físico" + item.id} style={{ display: 'none', flexDirection: 'column', justifyContent: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%', marginTop: 10 }}>
                        <textarea
                          disabled={true}
                          className="textarea"
                          title="APARELHO CARDIOVASCULAR."
                          style={{
                            minWidth: '45%',
                            width: '45%',
                            height: 80,
                            margin: 0,
                            marginRight: 10,
                          }}
                          type="text"
                          maxLength={50}
                          defaultValue={'APARELHO CARDIOVASCULAR: ' + item.acv}
                        ></textarea>
                        <textarea
                          disabled={true}
                          className="textarea"
                          title="APARELHO RESPIRATÓRIO."
                          style={{
                            minWidth: '45%',
                            width: '45%',
                            height: 80,
                            margin: 0,
                          }}
                          type="text"
                          maxLength={50}
                          defaultValue={'APARELHO RESPIRATÓRIO: ' + item.ap}
                        ></textarea>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%', marginTop: 10 }}>
                        <textarea
                          disabled={true}
                          className="textarea"
                          title="ABDOME."
                          style={{
                            minWidth: '45%',
                            width: '45%',
                            height: 80,
                            margin: 0,
                            marginRight: 10,
                          }}
                          type="text"
                          maxLength={50}
                          defaultValue={'ABDOME: ' + item.abdome}
                        ></textarea>
                        <textarea
                          disabled={true}
                          className="textarea"
                          title="OUTROS ACHADOS CLÍNICOS IMPORTANTES."
                          style={{
                            minWidth: '45%',
                            width: '45%',
                            height: 80,
                            margin: 0,
                          }}
                          type="text"
                          maxLength={50}
                          defaultValue={'OUTROS: ' + item.ap}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
              <button className="blue-button"
                onClick={() => viewEvolucao(1)}
                style={{ display: window.innerWidth > 800 ? 'none' : 'flex', marginRight: 7.5, marginTop: 2.5 }}
              >
                <img
                  alt=""
                  src={novo}
                  style={{
                    margin: 10,
                    height: 30,
                    width: 30,
                  }}
                ></img>
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }, [stateprontuario, listevolucoes, arrayevolucao]
  );

  // calculando o bh acumulado.
  const [bha, setbha] = useState(0);
  const loadBhacumulado = () => {
    axios.get(html + "/bhacumulado/'" + idatendimento + "'").then((response) => {
      var x = [0, 1];
      x = response.data;
      setbha(x.map((item) => item.bhacumulado));
    });
  }

  // ESCALAS.
  var effectColors = {
    highlight: 'rgba(255, 255, 255, 0.75)',
    shadow: 'rgba(0, 0, 0, 0.5)',
    glow: 'rgb(255, 255, 0)'
  };

  const dataChartPPS = (canvas) => {
    const ctx = canvas.getContext("2d");
    var gradient = ctx.createLinearGradient(0, 0, 0, 75);
    gradient.addColorStop(0, 'rgba(82, 190, 128, 0.3');
    gradient.addColorStop(1, 'transparent');

    return {
      labels: [
        '07/03/21',
        '16/04/21',
        '15/05/21',
        '18/06/21',
        '20/07/21',
        '30/08/21',
        '12/09/21',
        '21/10/21',
        '15/11/21',
      ],
      datasets: [
        {
          lineTension: 0,
          data: [60, 70, 50, 40, 60, 70, 80, 60, 70],
          pointBackgroundColor: ['#52be80', '#52be80', '#52be80', '#52be80', '#52be80', '#52be80', '#52be80', '#52be80', '#52be80'],
          fill: true,
          backgroundColor: 'transparent',
          borderColor: 'rgba(82, 190, 128, 1)',
          hoverBorderColor: ['#E1E5F2', '#E1E5F2', '#E1E5F2', '#E1E5F2', '#E1E5F2', '#E1E5F2', '#E1E5F2', '#E1E5F2', '#E1E5F2'],
          shadowOffsetX: 0,
          shadowOffsetY: 2,
          shadowBlur: 10,
          shadowColor: effectColors.shadow
        },
      ],
    }
  }

  const dataChartMIF = (canvas) => {
    const ctx = canvas.getContext("2d");
    var gradient = ctx.createLinearGradient(0, 0, 0, 75);
    gradient.addColorStop(0, 'rgba(82, 190, 128, 0.3');
    gradient.addColorStop(1, 'transparent');

    return {
      labels: [
        '07/03/21',
        '16/04/21',
        '15/05/21',
      ],
      datasets: [
        {
          lineTension: 0,
          borderRadius: 5,
          // borderWidth: 3,
          boxShadow: '0px 2px 20px 5px rgba(0, 0, 0, 0.1)',
          data: [6, 8, 7],
          pointBackgroundColor: ['#52be80', '#52be80', '#52be80'],
          fill: true,
          backgroundColor: 'transparent',
          boxShadow: '0px 2px 20px 5px rgba(0, 0, 0, 0.1)',
          borderColor: 'rgba(82, 190, 128, 1)',
          hoverBorderColor: ['#E1E5F2', '#E1E5F2', '#E1E5F2'],
          shadowOffsetX: 0,
          shadowOffsetY: 2,
          shadowBlur: 10,
          shadowColor: effectColors.shadow
        },
      ],
    }
  }

  const dataChartIVCF = (canvas) => {
    const ctx = canvas.getContext("2d");
    var gradient = ctx.createLinearGradient(0, 0, 0, 75);
    gradient.addColorStop(0, 'rgba(82, 190, 128, 0.3');
    gradient.addColorStop(1, 'transparent');

    return {
      labels: [
        '07/03/21',
        '16/04/21',
        '15/05/21',
        '18/11/21'
      ],
      datasets: [
        {
          lineTension: 0,
          borderRadius: 5,
          // borderWidth: 3,
          boxShadow: '0px 2px 20px 5px rgba(0, 0, 0, 0.1)',
          data: [6, 5, 7, 6],
          pointBackgroundColor: ['#52be80', '#52be80', '#52be80', '#52be80'],
          fill: true,
          backgroundColor: 'transparent',
          boxShadow: '0px 2px 20px 5px rgba(0, 0, 0, 0.1)',
          borderColor: 'rgba(82, 190, 128, 1)',
          hoverBorderColor: ['#E1E5F2', '#E1E5F2', '#E1E5F2', '#E1E5F2'],
          shadowOffsetX: 0,
          shadowOffsetY: 2,
          shadowBlur: 10,
          shadowColor: effectColors.shadow
        },
      ],
    }
  }

  // LISTA DE ESCALAS.
  // carregando as opções de escalas.
  const [opcoesescalas, setopcoesescalas] = useState([]);
  const loadOpcoesEscalas = () => {
    axios.get(htmlghapopcoesescalas).then((response) => {
      var x = [];
      x = response.data;
      setopcoesescalas(x.rows);
    })
  }

  const [listescalas, setlistescalas] = useState([]);
  const [arraylistescalas, setarraylistescalas] = useState([]);
  const loadEscalas = () => {
    axios.get(htmlghapescalas + idatendimento).then((response) => {
      var x = [];
      x = response.data;
      setlistescalas(x.rows.filter(item => item.idatendimento == idatendimento));
      setarraylistescalas(x.rows.filter(item => item.idatendimento == idatendimento));
    });
  }

  // atualizando ou suspendendo uma escala.
  const updateEscala = (item, valor) => {
    var obj = {
      idpct: item.idpct,
      idatendimento: item.idatendimento,
      data: item.data,
      cd_escala: item.cd_escala,
      ds_escala: item.ds_escala,
      valor_resultado: item.valor_resultado,
      ds_resultado: item.ds_resultado,
      idprofissional: item.idprofissional,
      status: 2 // escala suspensa.
    };
    axios.post(htmlghapupdateescala + item.id, obj).then(() => {
      toast(1, '#52be80', 'REGISTRO DE ESCALA CANCELADO COM SUCESSO.', 3000);
      loadEscalas();
    });
  }

  const [viewescalapps, setviewescalapps] = useState(0);
  const [viewescalamif, setviewescalamif] = useState(0);
  const [viewescalaivcf, setviewescalaivcf] = useState(0);

  const ShowEscalas = useCallback(() => {
    if (stateprontuario == 20) {
      return (
        <div className="scroll" style={{ height: '80vh', padding: 10, backgroundColor: 'transparent', borderColor: 'transparent' }}>
          {opcoesescalas.map(item => (
            <div className="card" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left' }}>
              <button
                className="blue-button"
                style={{ width: 120, minWidth: 120, height: 120, minHeight: 120, alignSelf: 'flex-start' }}
                onClick={() => setshowescala(item.cd_escala)}
              >
                {item.ds_escala}
              </button>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '65vw' }}>
                <div id="GRÁFICO" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '65vw', padding: 10 }}>
                  <Line
                    ref={myChartRef}
                    data={{
                      labels: arraylistescalas.filter(valor => valor.cd_escala == item.cd_escala)
                        .sort((a, b) => moment(a.data) > moment(b.data) ? 1 : -1).slice(-5)
                        .map(item => moment(item.data).format('DD/MM/YY')),
                      datasets: [
                        {
                          data: arraylistescalas.filter(valor => valor.cd_escala == item.cd_escala)
                            .sort((a, b) => moment(a.data) > moment(b.data) ? 1 : -1)
                            .map(item => item.valor_resultado),
                          // label: arraylistescalas.filter(valor => valor.cd_escala == item.cd_escala).map(item => moment(item.data).format('DD/MM/YY')),
                          borderColor: '#BB8FCE',
                          pointBackgroundColor: '#BB8FCE',
                          fill: 'false'
                        },
                      ],
                    }}
                    plugins={ChartDataLabels}
                    width="400"
                    height="100"
                    options={{
                      layout: {
                        padding: {
                          left: 0,
                          right: 4,
                          top: 0,
                          bottom: 0
                        }
                      },
                      scales: {
                        xAxes: [
                          {
                            display: true,
                            ticks: {
                              fontSize: 10,
                              width: 50,
                              padding: 10,
                              display: true,
                              fontColor: '#61636e',
                              fontWeight: 'bold',
                            },
                            gridLines: {
                              tickMarkLength: false,
                              zeroLineColor: 'transparent',
                              lineWidth: 1,
                              drawOnChartArea: true,
                            },
                          },
                        ],
                        yAxes: [
                          {
                            display: true,
                            ticks: {
                              padding: 10,
                              fontSize: 10,
                              display: true,
                              suggestedMin: 0,
                              suggestedMax:
                                item.cd_escala == 1 ? 23 :
                                  item.cd_escala == 2 ? 125 :
                                    item.cd_escala == 3 ? 5 :
                                      item.cd_escala == 4 ? 7 :
                                        item.cd_escala == 5 ? 10 :
                                          item.cd_escala == 6 ? 100 :
                                            item.cd_escala == 7 ? 10 :
                                              100,
                              fontColor: '#61636e',
                              fontWeight: 'bold',
                            },
                            gridLines: {
                              tickMarkLength: false,
                              zeroLineColor: 'transparent',
                              lineWidth: 1,
                              drawOnChartArea: true,
                            },
                          },
                        ],
                      },
                      plugins: {
                        datalabels: {
                          display: false,
                          color: '#ffffff',
                          font: {
                            weight: 'bold',
                            size: 16,
                          },
                        },
                      },
                      tooltips: {
                        enabled: true,
                        displayColors: false,
                      },
                      hover: { mode: null },
                      elements: {},
                      animation: {
                        duration: 500,
                      },
                      title: {
                        display: false,
                        text: 'PPS',
                      },
                      legend: {
                        display: false,
                        position: 'bottom',
                        align: 'start'
                      },
                      maintainAspectRatio: true,
                      responsive: true,
                    }}
                  />
                </div>
                <div id="CARDS COM VALORES" className="scroll" style={{ overflowX: 'scroll', overflowY: 'hidden', flexDirection: 'row', justifyContent: 'flex-start', width: '65vw' }}>
                  {arraylistescalas.filter(value => value.cd_escala == item.cd_escala)
                    .sort((a, b) => moment(a.data) > moment(b.data) ? 1 : -1)
                    .map(item => (
                      <div
                        key={item.id}
                        id="item da lista"
                        className="row"
                        title={item.ds_resultado}
                        style={{
                          flexDirection: 'column',
                          justifyContent: 'flex-start',
                          position: 'relative', opacity: item.status == 2 ? 0.5 : 1,
                          minWidth: 120,
                          width: 120, height: 120,
                          backgroundColor: 'lightgray'
                        }}
                      >
                        <div
                          style={{
                            position: 'absolute', bottom: 5, right: 5, display: 'flex',
                            flexDirection: 'row', justifyContent: 'center',
                            display: item.status == 2 ? 'none' : 'flex'
                          }}>
                          <button
                            id={"deletekey 0 " + item.id}
                            className="animated-red-button"
                            style={{ display: item.status == 2 ? 'none' : 'flex' }}
                            onClick={(e) => { deletetoast(updateEscala, item); e.stopPropagation() }}
                          >
                            <img
                              alt=""
                              src={deletar}
                              style={{
                                display: 'flex',
                                margin: 10,
                                height: 30,
                                width: 30,
                              }}
                            ></img>
                          </button>
                          <button
                            id={"deletekey 1 " + item.id}
                            style={{ display: 'none', width: 100 }}
                            className="animated-red-button"
                            onClick={(e) => { deletetoast(updateEscala, item); e.stopPropagation() }}
                          >
                            <div>DESFAZER</div>
                            <div className="deletetoast"
                              style={{
                                height: 5, borderRadius: 5, backgroundColor: 'pink', alignSelf: 'flex-start',
                                marginLeft: 5, marginRight: 5, maxWidth: 90,
                              }}>
                            </div>
                          </button>
                        </div>
                        <div className="title2center" style={{ fontWeight: 'bold', margin: 2.5, padding: 0 }}>{moment(item.data).format('DD/MM/YY')}</div>
                        <div className="title2center" style={{ fontSize: 22, margin: 2.5, padding: 0 }}>{item.valor_resultado}</div>
                        <div
                          title={item.ds_resultado}
                          className="title2center"
                          style={{ fontSize: 14, margin: 2.5, padding: 0 }}>
                          {JSON.stringify(item.ds_resultado).length > 20 ? item.ds_resultado.toString().substring(0, 20) + '...' : item.ds_resultado}</div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )
    } else {
      return null;
    }
  }, [stateprontuario, listescalas, arraylistescalas])

  // LISTA DE PROPOSTAS.
  // filtro para as propostas.
  function ShowFilterProposta() {
    if (stateprontuario === 4) {
      return (
        <div style={{ display: 'flex', flexDirection: 'row', margin: 5 }}>
          <input
            className="input"
            autoComplete="off"
            placeholder="BUSCAR PROPOSTA..."
            onFocus={(e) => (e.target.placeholder = '')}
            onBlur={(e) => (e.target.placeholder = 'BUSCAR PROPOSTA...')}
            onChange={() => filterProposta()}
            onClick={window.innerWidth < 400 ? (e) => {
              document.getElementById("identificação").style.display = "none";
              document.getElementById("inputFilterProposta").focus();
              e.stopPropagation();
            }
              : null
            }
            style={{
              width: '100%',
              margin: 0,
            }}
            type="text"
            id="inputFilterProposta"
            defaultValue={filterproposta}
            maxLength={100}
          ></input>
        </div >
      )
    } else {
      return null;
    }
  }

  const [filterproposta, setfilterproposta] = useState('');
  var searchproposta = '';
  var timeout = null;

  const filterProposta = () => {
    clearTimeout(timeout);
    document.getElementById("inputFilterProposta").focus();
    searchproposta = document.getElementById("inputFilterProposta").value.toUpperCase();
    timeout = setTimeout(() => {
      if (searchproposta === '') {
        setarraypropostas(listpropostas);
        document.getElementById("inputFilterProposta").value = '';
        document.getElementById("inputFilterProposta").focus();
      } else {
        setfilterproposta(document.getElementById("inputFilterProposta").value.toUpperCase());
        setarraypropostas(listpropostas.filter(item => item.proposta.includes(searchproposta) === true));
        document.getElementById("inputFilterProposta").value = searchproposta;
        document.getElementById("inputFilterProposta").focus();
      }
      if (window.innerWidth < 400) {
        document.getElementById("identificação").style.display = "none";
        document.getElementById("inputFilterProposta").focus();
      }
    }, 500);
  }

  // exibição da lista de propostas.
  const ShowPropostas = useCallback(() => {
    if (stateprontuario === 4) {
      return (
        <div
          className="conteudo"
          id="propostas"
          onClick={() => { document.getElementById("identificação").style.display = "flex"; document.getElementById("inputFilterProposta").value = ""; setarraypropostas(listpropostas) }}
        >
          <Filtros></Filtros>
          <div
            className="scroll"
            style={{ width: '100%', height: '90%', backgroundColor: 'transparent', borderColor: 'transparent' }}
            id="LISTA DE PROPOSTAS DESKTOP"
          >
            {arraypropostas.map((item) => (
              <p
                key={item.id}
                id="item da lista"
                className="row"
                style={{ opacity: item.status == 3 ? 0.5 : 1 }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                    <div id="proposta"
                      disabled={item.status == 3 ? true : false}
                      style={{
                        display: 'flex',
                        flexDirection: 'row', justifyContent: 'center'
                      }}>
                      <button
                        className={item.status == 0 ? "red-button" : item.status == 1 ? "green-button" : "grey-button"}
                        onClick={(e) => { updatePropostaGhapChecar(item); e.stopPropagation() }}
                        title={item.status == 0 ? "CLIQUE PARA MARCAR A PROPOSTA COMO REALIZADA." : item.status == 1 ? "CLIQUE PARA MARCAR A PROPOSTA COMO PENDENTE." : "PROPOSTA CANCELADA."}
                        disabled={item.status == 3 ? true : false}
                        style={{
                          flexDirection: 'row',
                          padding: 10,
                        }}
                      >
                        <div style={{ marginRight: item.datatermino == null ? 0 : 5 }}>
                          {item.datatermino == null ? '!' : '✔ '}
                        </div>
                        <div>{item.datatermino == null ? '' : moment(item.datatermino).format('DD/MM/YY')}</div>
                      </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                      <button
                        id={"deletekey 0 " + item.id}
                        style={{ display: item.status == 3 ? 'none' : 'flex' }}
                        className="animated-red-button"
                        onClick={(e) => { deletetoast(updatePropostaGhapInativar, item); e.stopPropagation() }}
                      >
                        <img
                          alt=""
                          src={deletar}
                          style={{
                            display: 'flex',
                            margin: 10,
                            height: 30,
                            width: 30,
                          }}
                        ></img>
                      </button>
                      <button
                        id={"deletekey 1 " + item.id}
                        style={{ display: 'none', width: 100 }}
                        className="animated-red-button"
                        onClick={(e) => { deletetoast(updatePropostaGhapInativar, item); e.stopPropagation() }}
                      >
                        <div>DESFAZER</div>
                        <div className="deletetoast"
                          style={{
                            height: 5, borderRadius: 5, backgroundColor: 'pink', alignSelf: 'flex-start',
                            marginLeft: 5, marginRight: 5, maxWidth: 90,
                          }}>
                        </div>
                      </button>
                    </div>
                  </div>
                  <div className="title2" style={{ marginBottom: 0, justifyContent: 'left' }}>
                    {moment(item.datainicio).format('DD/MM/YY') + ' - ' + item.proposta}
                  </div>
                  <div className="title2" style={{ marginTop: 0, justifyContent: 'left', opacity: 0.5 }}>
                    {'REGISTRADO POR ' + nomeusuario + ' EM ' + moment(item.datainicio).format('DD/MM/YY') + '.'}
                  </div>
                </div>
              </p>
            ))}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
              <button className="blue-button"
                onClick={() => viewProposta(1)}
                style={{ display: window.innerWidth > 800 ? 'none' : 'flex', marginRight: 7.5, marginTop: 2.5 }}
              >
                <img
                  alt=""
                  src={novo}
                  style={{
                    margin: 10,
                    height: 30,
                    width: 30,
                  }}
                ></img>
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }, [stateprontuario, arraypropostas]);


  // renderizando a tela INSERIR OU ATUALIZAR PROPOSTAS.
  const [viewproposta, setviewproposta] = useState(0);
  const viewProposta = (valor) => {
    setviewproposta(0);
    setTimeout(() => {
      setviewproposta(valor); // 1 para inserir proposta, 2 para atualizar proposta.
    }, 500);
  }

  // constantes relacionadas à lista de propostas:
  const [idproposta, setidproposta] = useState(0);
  const [proposta, setproposta] = useState('');
  const [inicioprop, setinicioprop] = useState(moment().format('DD/MM/YYYY'));
  const [terminoprop, setterminoprop] = useState('');

  const selectProposta = (item) => {
    window.scrollTo(0, 0);
    setidproposta(item.id);
    setproposta(item.proposta);
    setinicioprop(item.inicio);
    setterminoprop(item.termino);
    viewProposta(2);
  }

  // LISTA DE INTERCONSULTAS.
  const loadInterconsultas = () => {
    axios.get(htmlghapinterconsultas + idatendimento).then((response) => {
      var x = [];
      x = response.data;
      setlistinterconsultas(x.rows.filter(item => item.idatendimento == idatendimento).sort((a, b) => moment(a.datainicio, 'DD/MM/YYYY HH:MM') < moment(b.datainicio, 'DD/MM/YYYY HH:MM') ? 1 : -1));
      setarrayinterconsultas(x.rows.filter(item => item.idatendimento == idatendimento).sort((a, b) => moment(a.datainicio, 'DD/MM/YYYY HH:MM') < moment(b.datainicio, 'DD/MM/YYYY HH:MM') ? 1 : -1));
    });
  }

  // renderizando a tela INSERIR OU ATUALIZAR INTERCONSULTA.
  const [viewinterconsulta, setviewinterconsulta] = useState(0);
  const viewInterconsulta = (valor) => {
    setviewinterconsulta(0);
    setTimeout(() => {
      setviewinterconsulta(valor); // 1 para inserir interconsulta, 2 para atualizar interconsulta.
    }, 500);
  }

  // atualizando um pedido de interconsulta.
  const [idinterconsulta, setidinterconsulta] = useState(0);
  const [especialidadeinterconsulta, setespecialidadeinterconsulta] = useState('');
  const [motivointerconsulta, setmotivointerconsulta] = useState('');
  const [parecerinterconsulta, setparecerinterconsulta] = useState('');
  const [datainiciointerconsulta, setdatainiciointerconsulta] = useState('');
  const [dataterminointerconsulta, setdataterminointerconsulta] = useState('');
  const [idsolicitanteinterconsulta, setidsolicitanteinterconsulta] = useState('');
  const [idatendenteinterconsulta, setidatendenteinterconsulta] = useState('');
  const [statusinterconsulta, setstatusinterconsulta] = useState(0);

  const selectInterconsulta = (item) => {
    setidinterconsulta(item.id);
    setespecialidadeinterconsulta(item.especialidade);
    setmotivointerconsulta(item.motivo);
    setparecerinterconsulta(item.parecer);
    setdatainiciointerconsulta(item.datainicio);
    setdataterminointerconsulta(item.datatermino);
    setidsolicitanteinterconsulta(item.idsolicitante);
    setidatendenteinterconsulta(item.idatendente);
    viewInterconsulta(2);
  }

  // atualizando ou suspendendo uma interconsulta.
  const updateInterconsulta = (item, valor) => {
    var obj = {
      idpct: item.idpct,
      idatendimento: item.idatendimento,
      especialidade: item.especialidade,
      motivo: item.motivo,
      parecer: item.parecer,
      datainicio: moment(),
      datatermino: item.datatermino,
      idsolicitante: item.idsolicitante,
      idatendente: item.idatendente,
      status: valor, // 0 = registrada, 1 = assinada, 2 = respondida, 3 = suspensa.
      unidade: idunidade
    };
    axios.post(htmlghapupdateinterconsulta + item.id, obj).then(() => {
      toast(1, '#52be80', 'INTERCONSULTA ASSINADA COM SUCESSO.', 3000);
      loadInterconsultas();
    });
  }

  // deletando interconsulta ainda não assinada.
  const deleteInterconsulta = (item) => {
    axios.get(htmlghapdeleteinterconsulta + item.id).then(() => {
      loadInterconsultas();
    })
  }

  // filtro para as interconsultas.
  function ShowFilterInterconsultas() {
    if (stateprontuario === 5) {
      return (
        <div style={{ display: 'flex', flexDirection: 'row', margin: 5 }}>
          <input
            className="input"
            autoComplete="off"
            placeholder="BUSCAR INTERCONSULTA..."
            onFocus={(e) => (e.target.placeholder = '')}
            onBlur={(e) => (e.target.placeholder = 'BUSCAR INTERCONSULTA...')}
            onChange={() => filterInterconsulta()}
            style={{
              width: '100%',
              margin: 0,
            }}
            type="text"
            id="inputFilterInterconsulta"
            defaultValue={filterInterconsulta}
            maxLength={100}
          ></input>
        </div >
      )
    } else {
      return null;
    }
  }

  const [filterinterconsulta, setfilterinterconsulta] = useState('');
  var searchinterconsulta = '';
  var timeout = null;

  const filterInterconsulta = () => {
    clearTimeout(timeout);
    document.getElementById("inputFilterInterconsulta").focus();
    searchinterconsulta = document.getElementById("inputFilterInterconsulta").value.toUpperCase();
    timeout = setTimeout(() => {
      if (searchinterconsulta === '') {
        setarrayinterconsultas(listinterconsultas);
        document.getElementById("inputFilterInterconsulta").value = '';
        document.getElementById("inputFilterInterconsulta").focus();
      } else {
        setfilterinterconsulta(document.getElementById("inputFilterInterconsulta").value.toUpperCase());
        setarrayinterconsultas(listinterconsultas.filter(item => item.especialidade.includes(searchinterconsulta) === true));
        document.getElementById("inputFilterInterconsulta").value = searchinterconsulta;
        document.getElementById("inputFilterInterconsulta").focus();
      }
      if (window.innerWidth < 400) {
        document.getElementById("identificação").style.display = "none";
        document.getElementById("inputFilterInterconsulta").focus();
      }
    }, 500);
  }

  var showparecer = 0;

  // exibição da lista de interconsultas.
  const ShowIntercosultas = useCallback(() => {
    if (stateprontuario === 5) {
      return (
        <div
          id="interconsultas"
          className="conteudo"
        >
          <Filtros></Filtros>
          <div
            className="scroll"
            style={{ width: '100%', height: '90%', backgroundColor: 'transparent', borderColor: 'transparent' }}
            id="LISTA DE INTERCONSULTAS"
          >
            {arrayinterconsultas.map((item) => (
              <div
                key={item.id}
                id="item da lista"
                className="row"
              >
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                    <button
                      className="blue-button"
                      style={{
                        width: 250, padding: 10,
                        backgroundColor: item.status == 0 ? '#ec7063' : item.status == 1 ? '#f5b041' : '#52be80',
                      }}
                    >
                      {item.status == 0 ? 'ASSINATURA PENDENTE' : item.status == 1 ? 'AGUARDANDO AVALIAÇÃO' : item.status == 2 ? 'ESPECIALISTA ACOMPANHA' : item.status == 3 ? 'FINALIZADA' : 'CANCELADA'}
                    </button>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                      <button className="animated-green-button"
                        onClick={() => updateInterconsulta(item, 1)}
                        disabled={item.status != 0 ? true : false}
                        title="ASSINAR PEDIDO DE INTERCONSULTA."
                        style={{
                          marginRight: item.status == 0 ? 2.5 : -5,
                          display: item.status != 0 ? 'none' : 'flex',
                        }}
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
                      <button className="animated-red-button"
                        onClick={() => updateInterconsulta(item, 4)}
                        disabled={item.status != 1 ? true : false}
                        title="SUSPENDER PEDIDO DE INTERCONSULTA."
                        style={{
                          display: item.status != 1 ? 'none' : 'flex',
                          maxWidth: 50,
                          marginRight: -2.5,
                        }}
                      >
                        <img
                          alt=""
                          src={suspender}
                          style={{
                            margin: 10,
                            height: 30,
                            width: 30,
                          }}
                        ></img>
                      </button>
                      <button className="animated-yellow-button"
                        title="EDITAR PEDIDO DE INTERCONSULTA."
                        onClick={() => selectInterconsulta(item)}
                        style={{
                          display: item.status == 0 ? 'flex' : 'none',
                          marginRight: 2.5,
                        }}
                      >
                        <img
                          alt=""
                          src={editar}
                          style={{
                            margin: 10,
                            height: 30,
                            width: 30,
                          }}
                        ></img>
                      </button>
                      <button
                        id={"deletekey 0 " + item.id}
                        className="animated-red-button"
                        onClick={(e) => { deletetoast(deleteInterconsulta, item); e.stopPropagation() }}
                        title="EXCLUIR PEDIDO DE INTERCONSULTA."
                        style={{
                          display: item.status == 0 ? 'flex' : 'none',
                          marginRight: -2.5,
                        }}
                      >
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
                      <button
                        id={"deletekey 1 " + item.id}
                        style={{ display: 'none', width: 100 }}
                        className="animated-red-button"
                        onClick={(e) => { deletetoast(deleteInterconsulta, item); e.stopPropagation() }}
                      >
                        <div>DESFAZER</div>
                        <div className="deletetoast"
                          style={{
                            height: 5, borderRadius: 5, backgroundColor: 'pink', alignSelf: 'flex-start',
                            marginLeft: 5, marginRight: 5, maxWidth: 90,
                          }}>
                        </div>
                      </button>
                    </div>
                  </div>
                  <div className="title2" style={{ alignSelf: 'flex-start' }}> {moment(item.datainicio).format('DD/MM/YY') + ' - ' + item.especialidade} </div>
                  <div className="title2" style={{ alignSelf: 'flex-start', marginTop: 0, paddingTop: 0 }}> {'MOTIVO: ' + item.motivo} </div>
                  <div
                    className="hover-button"
                    onClick={() => {
                      if (showparecer == 0) {
                        showparecer = 1;
                        document.getElementById('parecer' + item.id).style.display = 'flex';
                      } else {
                        showparecer = 0;
                        document.getElementById('parecer' + item.id).style.display = 'none';
                      }
                    }}
                    style={{ display: item.parecer == "" ? 'none' : 'flex', alignSelf: 'flex-start', margin: 5, padding: 5 }}>
                    {'PARECER...'}
                  </div>
                  <div
                    id={'parecer' + item.id}
                    className="title2 fade-in"
                    style={{ display: 'none', marginLeft: 5, marginTop: 10, alignSelf: 'flex-start' }}
                  > {item.parecer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div >
      );
    } else {
      return null;
    }
  }, [stateprontuario, arrayinterconsultas]);

  // LISTA DE EXAMES LABORATORIAIS.
  const loadLaboratorio = () => {
    axios.get(html + "/lab/'" + idatendimento + "'").then((response) => {
      var x = [0, 1];
      x = response.data;
      setlistlaboratorio(x.sort((a, b) => moment(a.datapedido, 'DD/MM/YYYY HH:MM') < moment(b.datapedido, 'DD/MM/YYYY HH:MM') ? 1 : -1).filter(item => item.idatendimento == idatendimento));
      setarraylaboratorio(x.sort((a, b) => moment(a.datapedido, 'DD/MM/YYYY HH:MM') < moment(b.datapedido, 'DD/MM/YYYY HH:MM') ? 1 : -1).filter(item => item.idatendimento == idatendimento));
    });
  }

  // constantes relacionadas à lista de exames laboratoriais:
  const [idlab, setidlab] = useState(0);
  const [codigolab, setcodigolab] = useState(0);
  const [examelab, setexamelab] = useState('');
  const [resultadolab, setresultadolab] = useState('');
  const [statuslab, setstatuslab] = useState(0);
  const [datapedidolab, setdatapedidolab] = useState('');
  const [dataresultadolab, setdataresultadolab] = useState('');

  // filtro para busca de exames laboratoriais.
  function ShowFilterLaboratorio() {
    if (stateprontuario === 6) {
      return (
        <div style={{ display: 'flex', flexDirection: 'row', margin: 5 }}>
          <input
            className="input"
            autoComplete="off"
            placeholder="BUSCAR EXAME LABORATORIAL..."
            onFocus={(e) => (e.target.placeholder = '')}
            onBlur={(e) => (e.target.placeholder = 'BUSCAR EXAME LABORATORIAL...')}
            onChange={() => filterLaboratorio()}
            onClick={window.innerWidth < 400 ? (e) => {
              document.getElementById("identificação").style.display = "none";
              document.getElementById("inputFilterLaboratorio").focus();
              e.stopPropagation();
            }
              : null
            }
            style={{
              width: '100%',
              margin: 0,
            }}
            type="text"
            id="inputFilterLaboratorio"
            defaultValue={filterlaboratorio}
            maxLength={100}
          ></input>
        </div >
      )
    } else {
      return null;
    }
  }
  const [filterlaboratorio, setfilterlaboratorio] = useState('');
  var searchlaboratorio = '';
  var timeout = null;
  const filterLaboratorio = () => {
    clearTimeout(timeout);
    document.getElementById("inputFilterLaboratorio").focus();
    searchlaboratorio = document.getElementById("inputFilterLaboratorio").value.toUpperCase();
    timeout = setTimeout(() => {
      if (searchlaboratorio === '') {
        setarraylaboratorio(listlaboratorio);
        document.getElementById("inputFilterLaboratorio").value = '';
        document.getElementById("inputFilterLaboratorio").focus();
      } else {
        setfilterlaboratorio(document.getElementById("inputFilterLaboratorio").value.toUpperCase());
        setarraylaboratorio(listlaboratorio.filter(item => item.exame.includes(searchlaboratorio) === true));
        document.getElementById("inputFilterLaboratorio").value = searchlaboratorio;
        document.getElementById("inputFilterLaboratorio").focus();
      }
      if (window.innerWidth < 400) {
        document.getElementById("identificação").style.display = "none";
        document.getElementById("inputFilterLaboratorio").focus();
      }
    }, 500);
  }

  const selectLab = (item) => {
    setidlab(item.id);
    setcodigolab(item.codigo);
    setexamelab(item.exame);
    setresultadolab(item.resultado);
    setstatuslab(item.status);
    setdatapedidolab(item.datacoleta);
    setdataresultadolab(item.dataresultado);
  }

  // renderizando a tela INSERIR EXAME LABORATORIAL.
  const [viewlaboratorio, setviewlaboratorio] = useState(0);
  const viewLaboratorio = () => {
    setviewlaboratorio(0);
    setTimeout(() => {
      setviewlaboratorio(1); // 1 para inserir exame.
    }, 500);
  }

  // deletando um registro de exame laboratorial.
  const deleteLab = (item) => {
    axios.get(html + "/deletelab/'" + item.id + "'").then(() => {
      setfilterlaboratorio('');
      loadLaboratorio();
      // toast(1, '#52be80', 'PEDIDO DE EXAME LABORATORIAL CANCELADO COM SUCESSO.', 3000);
    });
  }

  // exibição da lista de exames laboratoriais.
  const ShowLaboratorio = useCallback(() => {
    if (stateprontuario === 6) {
      return (
        <div
          id="laboratório"
          className="conteudo"
          onClick={() => { document.getElementById("identificação").style.display = "flex"; document.getElementById("inputFilterLaboratorio").value = ""; setarraylaboratorio(listlaboratorio) }}
        >
          <Filtros></Filtros>
          <div
            className="scroll"
            style={{ width: '100%', height: '90%', backgroundColor: 'transparent', borderColor: 'transparent' }}
            id="LISTA DE EXAMES LABORATORIAIS"
          >
            {arraylaboratorio.map((item) => (
              <div
                key={item.id}
                id="item da lista"
                className="row"
              >
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>

                      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <button
                          className="blue-button"
                          style={{
                            width: 50,
                            height: 50,
                            margin: 2.5,
                            padding: 10,
                            flexDirection: 'column',
                            backgroundColor: item.status == 1 ? '#ec7063' : item.status == 2 ? '#f39c12' : '#52be80',
                          }}
                        >
                          <div>{item.status == 1 ? '!' : item.status == 2 ? <img alt=""
                            src={clock}
                            style={{
                              margin: 10,
                              height: 20,
                              width: 20,
                            }} ></img> : '✔'}</div>
                        </button>

                        <div className="title2" style={{ justifyContent: 'flex-start', marginBottom: 0 }}>
                          {item.resultado != '' ? item.exame + ': ' + item.resultado : item.exame}
                        </div>
                      </div>

                      <div className="title2" style={{ alignSelf: 'flex-start', marginTop: 0, marginBottom: 0, opacity: 0.5 }}>
                        {'REFERÊNCIA: ' + item.referencia}
                      </div>
                    </div>
                    <button
                      id={"deletekey 0 " + item.id}
                      className="animated-red-button"
                      onClick={(e) => { deletetoast(deleteLab, item); e.stopPropagation() }}
                      style={{ display: item.status === 'AGUARDANDO COLETA' ? 'flex' : 'none' }}
                    >
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
                    <button
                      id={"deletekey 1 " + item.id}
                      style={{ display: 'none', width: 100 }}
                      className="animated-red-button"
                      onClick={(e) => { deletetoast(deleteLab, item); e.stopPropagation() }}
                    >
                      <div>DESFAZER</div>
                      <div className="deletetoast"
                        style={{
                          height: 5, borderRadius: 5, backgroundColor: 'pink', alignSelf: 'flex-start',
                          marginLeft: 5, marginRight: 5, maxWidth: 90,
                        }}>
                      </div>
                    </button>
                  </div>
                  <div className="title2" style={{ flexDirection: 'row', justifyContent: 'flex-start', marginTop: 0, paddingTop: 0, opacity: 0.5 }}>
                    <div style={{ display: window.innerWidth > 400 ? 'flex' : 'none' }}>
                      {'SOLICITAÇÃO: ' + item.datapedido}
                    </div>
                    <div style={{ display: item.dataresultado == '' ? 'none' : 'flex', marginLeft: window.innerWidth > 400 ? 20 : 0 }}>
                      {'RESULTADO: ' + item.dataresultado}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
              <button className="blue-button"
                onClick={() => viewLaboratorio(1)}
                style={{ display: window.innerWidth > 800 ? 'none' : 'flex', marginRight: 7.5, marginTop: 2.5 }}
              >
                <img
                  alt=""
                  src={novo}
                  style={{
                    margin: 10,
                    height: 30,
                    width: 30,
                  }}
                ></img>
              </button>
            </div>
          </div>
        </div >
      );
    } else {
      return null;
    }
  }, [stateprontuario, listlaboratorio, arraylaboratorio]);

  // LISTA DE HEMODIÁLISES.
  //const loadHemodialises = () => {
  // ROTA: SELECT * FROM hemodialises WHERE idatendimento = idatendimento.
  //axios.get(html + "/hemodialises/'" + idatendimento + "'").then((response) => {
  //setlisthemodialises(response.data);
  //});
  //}

  // LISTA DE CULTURAS.
  //const loadCulturas = () => {
  // ROTA: SELECT * FROM culturas WHERE idatendimento = idatendimento.
  //axios.get(html + "/culturas/'" + idatendimento + "'").then((response) => {
  //setlistculturas(response.data);
  //});
  //}

  // LISTA DE EXAMES DE IMAGEM.
  const loadImagem = () => {
    axios.get(html + "/image/'" + idatendimento + "'").then((response) => {
      var x = [0, 1];
      x = response.data;
      setlistimagem(x.sort((a, b) => moment(a.datapedido, 'DD/MM/YYYY HH:MM') < moment(b.datapedido, 'DD/MM/YYYY HH:MM') ? 1 : -1).filter(item => item.idatendimento == idatendimento));
      setarrayimagem(x.sort((a, b) => moment(a.datapedido, 'DD/MM/YYYY HH:MM') < moment(b.datapedido, 'DD/MM/YYYY HH:MM') ? 1 : -1).filter(item => item.idatendimento == idatendimento));
    });
  }

  // GUILHERME E SEUS MOCKS:
  var arraymockimage = [{
    id: 1,
    codigo: 10,
    exame: 'RX DE TÓRAX AP',
    status: 1,
    pedido: '04/04/22',
    resultado: '04/04/22'
  }]
  const [arraymockimagem, setarraymockimagem] = useState(arraymockimage);

  const [viewrxmocked, setviewrxmocked] = useState(0);
  function ViewMockRx() {
    return (
      <div
        style={{
          position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
          display: viewrxmocked == 1 ? 'flex' : 'none', 
          flexDirection: 'row', justifyContent: 'center', alignContent: 'center', verticalAlign: 'center',
          alignItems: 'center',
          zIndex: 999,
        }}
        onClick={() => setviewrxmocked(0)}
      >
        <img
          alt=""
          src={rxmockado}
          style={{
            margin: 10,
            height: '80vh',
            width: '80vh',
            borderRadius: 5,
          }}
        ></img>
      </div>

    )
  }

  // constantes relacionadas à lista de exames de imagem:
  const [idimagem, setidimagem] = useState(0);
  const [codigoimagem, setcodigoimagem] = useState(0);
  const [exameimagem, setexameimagem] = useState('');
  const [laudoimagem, setlaudoimagem] = useState('');
  const [statusimagem, setstatusimagem] = useState(0);
  const [datapedidoimagem, setdatapedidoimagem] = useState('');
  const [dataresultadoimagem, setdataresultadoimagem] = useState('');

  // filtro para busca de exames laboratoriais.
  function ShowFilterImagem() {
    if (stateprontuario === 7) {
      return (
        <div style={{ display: 'flex', flexDirection: 'row', margin: 5 }}>
          <input
            className="input"
            autoComplete="off"
            placeholder="BUSCAR EXAME DE IMAGEM..."
            onFocus={(e) => (e.target.placeholder = '')}
            onBlur={(e) => (e.target.placeholder = 'BUSCAR EXAME DE IMAGEM...')}
            onChange={() => filterImagem()}
            onClick={window.innerWidth < 400 ? (e) => {
              document.getElementById("identificação").style.display = "none";
              document.getElementById("inputFilterImagem").focus();
              e.stopPropagation();
            }
              : null
            }
            style={{
              width: '100%',
              margin: 0,
            }}
            type="text"
            id="inputFilterImagem"
            defaultValue={filterimagem}
            maxLength={100}
          ></input>
        </div >
      )
    } else {
      return null;
    }
  }
  //
  const [filterimagem, setfilterimagem] = useState('');
  var searchimagem = '';
  var timeout = null;
  const filterImagem = () => {
    clearTimeout(timeout);
    document.getElementById("inputFilterImagem").focus();
    searchimagem = document.getElementById("inputFilterImagem").value.toUpperCase();
    timeout = setTimeout(() => {
      if (searchimagem === '') {
        setarrayimagem(listimagem);
        document.getElementById("inputFilterImagem").value = '';
        document.getElementById("inputFilterImagem").focus();
      } else {
        setfilterimagem(document.getElementById("inputFilterImagem").value.toUpperCase());
        setarrayimagem(listimagem.filter(item => item.exame.includes(searchimagem) === true));
        document.getElementById("inputFilterImagem").value = searchimagem;
        document.getElementById("inputFilterImagem").focus();
      }
      if (window.innerWidth < 400) {
        document.getElementById("identificação").style.display = "none";
        document.getElementById("inputFilterImagem").focus();
      }
    }, 500);
  }

  const selectImagem = (item) => {
    setidimagem(item.id);
    setcodigoimagem(item.codigo);
    setexameimagem(item.exame);
    setlaudoimagem(item.laudo);
    setstatusimagem(item.status);
    setdatapedidoimagem(item.datapedido);
    setdataresultadoimagem(item.dataresultado);
  }
  // renderizando a tela INSERIR EXAME DE IMAGEM.
  const [viewimagem, setviewimagem] = useState(0);
  const viewImagem = () => {
    setviewimagem(0);
    setTimeout(() => {
      setviewimagem(1); // 1 para inserir exame.
    }, 500);
  }
  // deletando um registro de exame de imagem.
  const deleteImagem = (item) => {
    axios.get(html + "/deleteimage/'" + item.id + "'").then(() => {
      setfilterimagem('');
      loadImagem();
      // toast(1, '#52be80', 'SOLICITAÇÃO DE EXAME DE IMAGEM CANCELADA COM SUCESSO.', 3000);
    });
  }
  // exibição da lista de exames de imagem.
  function ShowImagem() {
    if (stateprontuario === 7) {
      return (
        <div
          id="imagem"
          className="conteudo"
          onClick={() => { document.getElementById("identificação").style.display = "flex"; document.getElementById("inputFilterImagem").value = ""; setarrayimagem(listimagem); setarrayimagem(listimagem) }}
        >
          <Filtros></Filtros>
          <div
            className="scroll"
            style={{ width: '100%', height: '90%', backgroundColor: 'transparent', borderColor: 'transparent' }}
            id="LISTA DE EXAMES DE IMAGEM"          >
            {arraymockimagem.map((item) => (
              <div
                key={item.id}
                id="item da lista"
                className="row"
              >
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>

                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                      <button
                        className="blue-button"
                        style={{
                          width: 50,
                          height: 50,
                          margin: 2.5,
                          padding: 10,
                          flexDirection: 'column',
                          backgroundColor: item.status == 1 ? '#ec7063' : item.status == 2 ? '#f39c12' : '#52be80',
                        }}
                      >
                        <div>{item.status == 1 ? '!' : item.status == 2 ? <img alt=""
                          src={clock}
                          style={{
                            margin: 10,
                            height: 20,
                            width: 20,
                          }} ></img> : '✔'}</div>
                      </button>
                      <div className="title2" style={{ justifyContent: 'flex-start', marginBottom: 0 }}>
                        {item.exame}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                      <button
                        id="viewimage"
                        className="animated-blue-button" style={{ display: 'flex' }}
                        onClick={() => setviewrxmocked(1)}
                      >
                        <img
                          alt=""
                          src={viewimage}
                          style={{
                            margin: 10,
                            height: 30,
                            width: 30,
                          }}
                        ></img>
                      </button>
                      <button
                        id={"deletekey 0 " + item.id}
                        className="animated-red-button"
                        onClick={(e) => { deletetoast(deleteImagem, item); e.stopPropagation() }}
                        style={{ display: item.status == 1 ? 'flex' : 'none' }}
                      >
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
                      <button
                        id={"deletekey 1 " + item.id}
                        style={{ display: 'none', width: 100 }}
                        className="animated-red-button"
                        onClick={(e) => { deletetoast(deleteImagem, item); e.stopPropagation() }}
                      >
                        <div>DESFAZER</div>
                        <div className="deletetoast"
                          style={{
                            height: 5, borderRadius: 5, backgroundColor: 'pink', alignSelf: 'flex-start',
                            marginLeft: 5, marginRight: 5, maxWidth: 90,
                          }}>
                        </div>
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                    <div className="title2" style={{ flexDirection: 'row', justifyContent: 'flex-start', marginTop: 0, opacity: 0.5 }}>
                      <div>
                        {'SOLICITAÇÃO: ' + item.pedido}
                      </div>
                      <div style={{ display: item.resultado == '' ? 'none' : 'flex', marginLeft: 10 }}>
                        {'RESULTADO: ' + item.resultado}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
              <button className="blue-button"
                onClick={() => viewImagem(1)}
                style={{ display: window.innerWidth > 800 ? 'none' : 'flex', marginRight: 7.5, marginTop: 2.5 }}
              >
                <img
                  alt=""
                  src={novo}
                  style={{
                    margin: 10,
                    height: 30,
                    width: 30,
                  }}
                ></img>
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  // LISTA DE BALANÇOS HÍDRICOS.
  // carregando a lista de balanços.
  const loadBalancos = () => {
    var x = [0, 1];
    axios.get(html + "/balancos/" + idatendimento).then((response) => {
      x = response.data;
      setlistbalancos(x.sort((a, b) => a.id > b.id ? 1 : -1));
    });
  }
  // deletando um balanço.
  const deleteBalanco = (item) => {
    axios.get(html + "/deletebalanco/" + item.id);
    setTimeout(() => {
      // deletando todos os itens de ganho associados ao balanço excluído.
      axios.get(html + "/deleteallganhos/" + item.id);
      // deletando todos os itens de perda associados ao balanço excluído.
      axios.get(html + "/deleteallperdas/" + item.id);
      loadBalancos();
    }, 1000);
  }
  // assinando um balanço.
  const signBalanco = (item) => {
    var obj = {
      idatendimento: item.idatendimento,
      data: item.data,
      hora: item.hora,
      pas: item.pas,
      pad: item.pad,
      fc: item.fc,
      fr: item.fr,
      sao2: item.sao2,
      tax: item.tax,
      diurese: item.diurese,
      fezes: item.fezes,
      status: 1, // assinado.
      usuario: item.usuario,
    };
    axios.post(html + '/updatebalanco/' + item.id, obj);
  };
  // suspendendo um balanço assinando.
  const suspendBalanco = (item) => {
    var obj = {
      idatendimento: item.idatendimento,
      data: item.data,
      hora: item.hora,
      pas: item.pas,
      pad: item.pad,
      fc: item.fc,
      fr: item.fr,
      sao2: item.sao2,
      tax: item.tax,
      diurese: item.diurese,
      fezes: item.fezes,
      status: 2, // suspenso.
      usuario: item.usuario,
    };
    axios.post(html + '/updatebalanco/' + item.id, obj);
  };
  // copiando um balanço assinando.
  const copyBalanco = (item) => {
    var obj = {
      idatendimento: item.idatendimento,
      data: moment().format('DD/MM/YYYY') + ' ' + moment().format('HH') + ':00',
      hora: moment().format('HH') + ':00',
      pas: item.pas,
      pad: item.pad,
      fc: item.fc,
      fr: item.fr,
      sao2: item.sao2,
      tax: item.tax,
      diurese: item.diurese,
      fezes: item.fezes,
      status: 0,
      usuario: item.usuario,
    };
    axios.post(html + '/insertbalanco', obj);
  };
  // inserindo um balanço.
  const newBalanco = (item) => {
    var obj = {
      idatendimento: idatendimento,
      data: moment().format('DD/MM/YYYY') + ' ' + moment().format('HH') + ':00',
      hora: moment().format('HH') + ':00',
      pas: '?',
      pad: '?',
      fc: '?',
      fr: '?',
      sao2: '?',
      tax: '?',
      diurese: '?',
      fezes: '?',
      status: 0, // aberto.
      usuario: nomeusuario,
    };
    axios.post(html + '/insertbalanco', obj).then(() => loadBalancos());
  };

  // selecionando um registro de balanço na lista de balanços hídricos.
  const [idbalanco, setidbalanco] = useState();
  const [databalanco, setdatabalanco] = useState();
  const [horabalanco, sethorabalanco] = useState();
  const updateBalanco = (item) => {
    setidbalanco(item.id);
    setdatabalanco(item.data);
    sethorabalanco(item.hora);
    setpas(item.pas);
    setpad(item.pad);
    setfc(item.fc);
    setfr(item.fr);
    setsao2(item.sao2);
    settax(item.tax);
    setdiu(item.diurese);
    setfezes(item.fezes);
    viewBalanco(2);
  }

  // renderizando a tela INSERIR OU ATUALIZAR BALANÇO HÍDRICO.
  // const [viewbalanco, setviewbalanco] = useState(0);
  const viewBalanco = (valor) => {
    setviewbalanco(0);
    setTimeout(() => {
      setviewbalanco(valor); // 1 para inserir balanco, 2 para atualizar balanço.
    }, 500);
  }

  // TRATAMENTO DE DADOS DO BALANÇO HÍDRICO.
  // soma de ganhos e perdas, para exibição nos balanços.
  function getSum(total, num) {
    return total + num;
  }
  const [somaganhos, setsomaganhos] = useState([]);
  const getSomaGanhos = () => {
    axios.get(html + "/itensganhossoma/" + idatendimento).then((response) => {
      var x = response.data;
      setsomaganhos(response.data);
    });
  }
  const [somaperdas, setsomaperdas] = useState([]);
  const getSomaPerdas = () => {
    axios.get(html + "/itensperdassoma/" + idatendimento).then((response) => {
      var x = response.data;
      setsomaperdas(response.data);
    });
  }

  // recuperando o total de diurese nas últimas 12h.
  const [diurese12h, setdiurese12h] = useState(0);
  const getDiurese12h = () => {
    // filtrando os balanços registrados nas últimas 12h.
    var x12h = listbalancos.filter((item) => moment().diff(moment(item.data, 'DD/MM/YY HH:mm'), 'hours') < 13);
    // selecionando apenas os valores de diurese dos balanços acima filtrados.
    var xdiurese = x12h.map((item) => parseInt(item.diurese));
    // somando o total de diurese.
    var volbok = xdiurese.reduce(getSum, 0);
    setdiurese12h(xdiurese.reduce(getSum, 0));
  }

  // recuperando o balanço hídrico nas últimas 12h.
  // >> ganhos.
  var arrayganhos = [];
  const [ganhos12h, setganhos12h] = useState([]);
  const getGanhos = (value) => {
    axios.get(html + "/itensganhos/" + value).then((response) => {
      var x = response.data;
      // somando os ganhos de um registro de balanço.
      var y = x.map((item) => item.valor).reduce(getSum, 0);
      // acrescentando o valor da soma à arrayganhos.
      arrayganhos.push(y);
      // somando os valores da arrayganhos.
      setganhos12h(arrayganhos.reduce(getSum, 0));
    });
  }
  // >> perdas.
  var arrayperdas = [];
  const [perdas12h, setperdas12h] = useState([]);
  const getPerdas = (value) => {
    axios.get(html + "/itensperdas/" + value).then((response) => {
      var x = response.data;
      // somando as perdas de um registro de balanço.
      var y = x.map((item) => item.valor).reduce(getSum, 0);
      // acrescentando o valor da soma à arrayperdas.
      arrayperdas.push(y);
      // somando os valores da arrayperdas.
      setperdas12h(arrayperdas.reduce(getSum, 0));
    });
  }

  // recuperando o balanço hídrico acumulado.
  // >> ganhos.
  var arrayganhosacumulados = [];
  const [ganhosacumulados, setganhosacumulados] = useState([]);
  const getGanhosAcumulados = (value) => {
    axios.get(html + "/itensganhos/" + value).then((response) => {
      var x = response.data;
      // somando os ganhos de um registro de balanço.
      var y = x.map((item) => item.valor).reduce(getSum, 0);
      // acrescentando o valor da soma à arrayganhos.
      arrayganhosacumulados.push(y);
      // somando os valores da arrayganhos.
      setganhosacumulados(arrayganhosacumulados.reduce(getSum, 0));
    });
  }
  // >> perdas.
  var arrayperdasacumuladas = [];
  const [perdasacumuladas, setperdasacumuladas] = useState([]);
  const getPerdasAcumuladas = (value) => {
    axios.get(html + "/itensperdas/" + value).then((response) => {
      var x = response.data;
      // somando as perdas de um registro de balanço.
      var y = x.map((item) => item.valor).reduce(getSum, 0);
      // acrescentando o valor da soma à arrayperdas.
      arrayperdasacumuladas.push(y);
      // somando os valores da arrayperdas.
      setperdasacumuladas(arrayperdasacumuladas.reduce(getSum, 0));
    });
  }

  // obtendo os valores para cálculo do bh 12h.
  const [bh12h, setbh12h] = useState(0);
  const getBh12h = () => {
    // filtrando os balanços registrados nas últimas 12h.
    var x12h = listbalancos.filter((item) => moment().diff(moment(item.data, 'DD/MM/YY HH:mm'), 'hours') < 13);
    // obtendo a soma de ganhos para cada id de balanço.
    x12h.map((item) => getGanhos(item.id));
    // obtendo a soma de perdas para cada id de balanço.
    x12h.map((item) => getPerdas(item.id));
  }

  // obtendo os valores para cálculo do bh acumulado.
  const [bhacumulado, setbhacumulado] = useState(0);
  const getBhAcumulado = () => {
    // obtendo a soma de ganhos para cada id de balanço.
    listbalancos.map((item) => getGanhosAcumulados(item.id));
    // obtendo a soma de perdas para cada id de balanço.
    listbalancos.map((item) => getPerdasAcumuladas(item.id));
  }

  // exibição da lista de propostas.
  function ShowBalancos() {
    if (stateprontuario === 8) {
      return (
        <div
          id="balanços"
          className="conteudo">
          <Filtros></Filtros>
          <div
            className="scroll"
            style={{ width: '100%', height: '90%', backgroundColor: 'transparent', borderColor: 'transparent' }}
            id="LISTA DE BALANÇOS"
          >
            {listbalancos.map((item) => (
              <div
                key={item.id}
                id="item da lista"
                className="row"
              >
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
                  <div id="GANHOS E PERDAS + BOTÕES" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <div id="DATA E HORA" className={item.status == 0 ? "red-button" : "green-button"}
                      style={{
                        width: 100, minWidth: 100, padding: 10,
                        backgroundColor: item.status == 0 ? '#ec7063' : '#52be80',
                      }}>
                      {item.data}
                    </div>
                    <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                      <button className="animated-green-button"
                        onClick={() => copyBalanco(item)}
                        style={{
                          marginRight: 2.5,
                          display: item.status === 1 ? 'flex' : 'none',
                        }}
                      >
                        <img
                          alt=""
                          src={copiar}
                          style={{
                            margin: 10,
                            height: 30,
                            width: 30,
                          }}
                        ></img>
                      </button>
                      <button className={item.status === 0 ? "animated-green-button" : "animated-red-button"}
                        onClick={item.status === 0 ? () => signBalanco(item) : () => suspendBalanco(item)}
                        disabled={item.status === 2 ? true : false}
                        style={{
                          marginRight: 2.5, boxShadow: 'none',
                        }}
                      >
                        <img
                          alt=""
                          src={item.status === 0 ? salvar : suspender}
                          style={{
                            margin: 10,
                            height: 30,
                            width: 30,
                          }}
                        ></img>
                      </button>
                      <button className="animated-yellow-button"
                        onClick={() => updateBalanco(item)}
                        style={{
                          display: item.status === 0 ? 'flex' : 'none',
                          marginRight: 2.5, boxShadow: 'none',
                        }}
                      >
                        <img
                          alt=""
                          src={editar}
                          style={{
                            margin: 10,
                            height: 30,
                            width: 30,
                          }}
                        ></img>
                      </button>
                      <button
                        id={"deletekey 0 " + item.id}
                        className="animated-red-button"
                        onClick={(e) => { deletetoast(deleteBalanco, item); e.stopPropagation() }}
                        style={{
                          display: item.status === 0 ? 'flex' : 'none', boxShadow: 'none',
                        }}
                      >
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
                      <button
                        id={"deletekey 1 " + item.id}
                        style={{ display: 'none', width: 100 }}
                        className="animated-red-button"
                        onClick={(e) => { deletetoast(deleteBalanco, item); e.stopPropagation() }}
                      >
                        <div>DESFAZER</div>
                        <div className="deletetoast"
                          style={{
                            height: 5, borderRadius: 5, backgroundColor: 'pink', alignSelf: 'flex-start',
                            marginLeft: 5, marginRight: 5, maxWidth: 90,
                          }}>
                        </div>
                      </button>
                    </div>
                  </div>
                  <div id="balanço" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                    <div
                      className="title2" style={{ width: 200, justifyContent: 'flex-start' }}
                    >
                      {'TOTAL DE GANHOS: ' + somaganhos.filter(value => value.idbalanco === item.id).map((item) => item.valor).reduce(getSum, 0)}
                    </div>
                    <div
                      className="title2" style={{ width: 200 }}
                    >
                      {'TOTAL DE PERDAS: ' + (somaperdas.filter(value => value.idbalanco === item.id).map((item) => item.valor).reduce(getSum, 0) + parseInt(item.diurese))}
                    </div>
                  </div>
                  <div id="DADOS VITAIS" className="blue-button" style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#8f9bbc' }}>
                    <div
                      className="title2"
                      style={{
                        margin: 2.5,
                        padding: 10,
                        color: '#ffffff',
                      }}
                    >
                      {'PAM: ' + Math.ceil((2 * parseInt(item.pad) + parseInt(item.pas)) / 3) + 'mmHg'}
                    </div>
                    <div
                      className="title2"
                      style={{
                        margin: 2.5,
                        padding: 10,
                        color: '#ffffff',
                      }}
                    >
                      {'FC: ' + item.fc + ' BPM'}
                    </div>
                    <div
                      className="title2"
                      style={{
                        margin: 2.5,
                        padding: 10,
                        color: '#ffffff',
                      }}
                    >
                      {'FR: ' + item.fr + ' IRPM'}
                    </div>
                    <div
                      className="title2"
                      style={{
                        margin: 2.5,
                        padding: 10,
                        color: '#ffffff',
                      }}
                    >
                      {'SAO2: ' + item.sao2 + '%'}
                    </div>
                    <div
                      className="title2"
                      style={{
                        margin: 2.5,
                        padding: 10,
                        color: '#ffffff',
                      }}
                    >
                      {'TAX: ' + item.tax + '°C'}
                    </div>
                    <div
                      className="title2"
                      style={{
                        margin: 2.5,
                        padding: 10,
                        color: '#ffffff',
                      }}
                    >
                      {'DIURESE: ' + item.diurese}
                    </div>
                    <div
                      className="title2"
                      style={{
                        margin: 2.5,
                        padding: 10,
                        color: '#ffffff',
                      }}
                    >
                      {'EVACUAÇÕES: ' + item.fezes}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div >
      )
    } else {
      return null
    }
  }

  // bloqueando a scroll (ao exibir telas secundárias e modais).
  function noScroll() {
    window.scrollTo(0, 0);
  }

  const [viewupdateatendimento, setviewupdateatendimento] = useState(0);
  const [viewevolucao, setviewevolucao] = useState(0);
  const [viewbalanco, setviewbalanco] = useState(0);
  const [viewprintevolucao, setviewprintevolucao] = useState(0);
  const [viewformulario, setviewformulario] = useState(0);

  const [atendimento, setatendimento] = useState([]);

  // API RODRIGO (BANCO DE DADOS POSTGRE GHAP).
  var htmlghapatendimentos = process.env.REACT_APP_API_CLONE_ATENDIMENTOS;
  var htmlghapinsertatendimento = process.env.REACT_APP_API_CLONE_INSERTATENDIMENTO;

  var htmlghapprecaucoesoptions = process.env.REACT_APP_API_CLONE_PRECAUCOESOPTIONS;
  var htmlghapprecaucoes = process.env.REACT_APP_API_CLONE_PRECAUCOES;
  var htmlghapinsertprecaucao = process.env.REACT_APP_API_CLONE_INSERTPRECAUCAO;
  var htmlghapupdateprecaucao = process.env.REACT_APP_API_CLONE_UPDATEPRECAUCAO;

  var htmlghapalergias = process.env.REACT_APP_API_CLONE_ALERGIAS;
  var htmlghapinsertalergia = process.env.REACT_APP_API_CLONE_INSERTALERGIA;
  var htmlghapupdatealergia = process.env.REACT_APP_API_CLONE_UPDATEALERGIA;

  var htmlghapcid = process.env.REACT_APP_API_CLONE_CID;
  var htmlghapdiagnosticos = process.env.REACT_APP_API_CLONE_DIAGNOSTICOS;
  var htmlghapinsertdiagnostico = process.env.REACT_APP_API_CLONE_INSERTDIAGNOSTICO;
  var htmlghapupdatediagnostico = process.env.REACT_APP_API_CLONE_UPDATEDIAGNOSTICO;

  var htmlghappropostas = process.env.REACT_APP_API_CLONE_PROPOSTAS;
  var htmlghapinsertproposta = process.env.REACT_APP_API_CLONE_INSERTPROPOSTA;
  var htmlghapupdateproposta = process.env.REACT_APP_API_CLONE_UPDATEPROPOSTA;

  var htmlghapdietas = process.env.REACT_APP_API_CLONE_DIETAS;
  var htmlghapinsertdieta = process.env.REACT_APP_API_CLONE_INSERTPROPOSTA;
  var htmlghapupdatedieta = process.env.REACT_APP_API_CLONE_UPDATEPROPOSTA;

  var htmlghapinvasoes = process.env.REACT_APP_API_CLONE_INVASOES;
  var htmlghapinsertinvasao = process.env.REACT_APP_API_CLONE_INSERTINVASAO;
  var htmlghapupdateinvasao = process.env.REACT_APP_API_CLONE_UPDATEINVASAO;

  var htmlghaplesoes = process.env.REACT_APP_API_CLONE_LESOES;
  var htmlghapinsertlesao = process.env.REACT_APP_API_CLONE_INSERTLESAO;
  var htmlghapupdatelesao = process.env.REACT_APP_API_CLONE_UPDATELESAO;

  var htmlghapinterconsultas = process.env.REACT_APP_API_CLONE_INTERCONSULTAS;
  var htmlghapinsertinterconsulta = process.env.REACT_APP_API_CLONE_INSERTINTERCONSULTA;
  var htmlghapupdateinterconsulta = process.env.REACT_APP_API_CLONE_UPDATEINTERCONSULTA;
  var htmlghapdeleteinterconsulta = process.env.REACT_APP_API_CLONE_DELETEINTERCONSULTA;

  var htmlghapescalas = process.env.REACT_APP_API_CLONE_ESCALAS;
  var htmlghapopcoesescalas = process.env.REACT_APP_API_CLONE_OPCOES_ESCALAS;
  var htmlghapinsertescala = process.env.REACT_APP_API_CLONE_INSERTESCALA;
  var htmlghapupdateescala = process.env.REACT_APP_API_CLONE_UPDATEESCALA;
  var htmlghapdeleteescala = process.env.REACT_APP_API_CLONE_DELETEESCALA;

  // ATENDIMENTO.
  // retornando atendimentos.
  const getAtendimentosGhap = () => {
    axios.get(htmlghapatendimentos).then((response) => {
      x = response.data;
    });
  }

  // criando o atendimento no banco de dados Ghap, em correspondência com o MV, caso ainda não exista.
  const createAtendimentoGhap = () => {
    axios.get(htmlghapatendimentos).then((response) => {
      var x = [0, 1];
      var y = [0, 1];
      x = response.data;
      y = x.rows;
      //alert('IDATENDIMENTO: ' + idatendimento);
      //alert(y.map(item => item.idatendimento));
      //alert(y.filter(item => item.idatendimento == idatendimento).length);
      if (y.filter(item => item.idatendimento == idatendimento).length > 0) {
        //alert('ATENDIMENTO JÁ EXISTE');
      } else {
        //alert('CLONANDO ATENDIMENTO DO MV');
        var obj = {
          idpct: idpaciente,
          idatendimento: idatendimento,
        }
        axios.post(htmlghapinsertatendimento, obj);
      };
    });
  }

  // PRECAUÇÕES (LISTA DE OPÇÕES).
  const [precaucoesoptions, setprecaucoesoptions] = useState([0, 1]);
  const [idprecaucao, setidprecaucao] = useState(0);
  const [nomeprecaucao, setnomeprecaucao] = useState('');
  const getPrecaucoesOptionsGhap = () => {
    axios.get(htmlghapprecaucoesoptions).then((response) => {
      var x = [];
      x = response.data;
      setprecaucoesoptions(x.rows);
    });
  }

  // PRECAUÇÕES (ATENDIMENTO).
  const [ghapprecaucoes, setghapprecaucoes] = useState([]);
  // lista de precauções para o atendimento.
  const getPrecaucoesGhap = () => {
    axios.get(htmlghapprecaucoes + idatendimento).then((response) => {
      var x = [];
      x = response.data;
      setghapprecaucoes(x.rows);
    });
  }
  // inserir precaução.
  const insertPrecaucaoGhap = (id, nome) => {
    if (ghapprecaucoes.filter(item => item.idprecaucao == id && item.datatermino == null).length > 0) {
      toast(1, '#ec7063', 'PRECAUÇÃO JÁ CADASTRADA', 3000);
    } else {
      var obj = {
        idpct: idpaciente,
        idatendimento: idatendimento,
        idprecaucao: id,
        nome: nome,
        datainicio: moment(),
        idprofissional: 0,
        datatermino: null,
      }
      axios.post(htmlghapinsertprecaucao, obj).then(() => {
        getPrecaucoesGhap();
        setviewprecaucoesoptions(0);
      });
    }
  }
  // atualizar precaucao (inativar).
  const updatePrecaucaoGhap = (item) => {
    var obj = {
      idpct: idpaciente,
      idatendimento: idatendimento,
      idprecaucao: item.idprecaucao,
      nome: item.nome,
      datainicio: item.datainicio,
      idprofissional: 0,
      datatermino: moment(),
    }
    axios.post(htmlghapupdateprecaucao + item.id, obj).then(() => {
      getPrecaucoesGhap();
    });
  }

  // ALERGIAS (ATENDIMENTO).
  const [ghapalergias, setghapalergias] = useState([]);
  // lista de alergias para o atendimento.
  const getAlergiasGhap = () => {
    axios.get(htmlghapalergias + idatendimento).then((response) => {
      var x = [];
      x = response.data;
      setghapalergias(x.rows);
    });
  }
  // inserir alergia.
  const insertAlergiaGhap = () => {
    var alergia = '';
    alergia = document.getElementById("inputAlergia").value;
    var obj = {
      idpct: idpaciente,
      idatendimento: idatendimento,
      nome: alergia.toUpperCase(),
      datainicio: moment(),
      datatermino: null,
      idprofissional: 0,
    }
    axios.post(htmlghapinsertalergia, obj).then(() => {
      setalergiafield(0);
      getAlergiasGhap();
    });
  }
  // atualizar alergia (inativar).
  const updateAlergiaGhap = (item) => {
    var obj = {
      idpct: idpaciente,
      idatendimento: idatendimento,
      idprecaucao: item.idprecaucao,
      nome: item.nome,
      datainicio: item.datainicio,
      idprofissional: 0,
      datatermino: moment(),
    }
    axios.post(htmlghapupdatealergia + item.id, obj).then(() => {
      getAlergiasGhap();
    });
  }

  // DIAGNÓSTICOS (ATENDIMENTO).
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
  const insertDiagnosticoGhap = (cid, descricao) => {
    if (ghapprecaucoes.filter(item => item.cid == cid && item.datatermino == null).length > 0) {
      toast(1, '#ec7063', 'DIAGNÓSTICO JÁ CADASTRADO E ATIVO.', 3000);
    } else {
      var obj = {
        idpct: idpaciente,
        idatendimento: idatendimento,
        datainicio: moment(),
        datatermino: null,
        idprofissional: 0,
        cid: cid,
        descricao: descricao,
      }
      axios.post(htmlghapinsertdiagnostico, obj).then(() => {
        setcidselector(0);
        getDiagnosticosGhap();
      });
    }
  }
  // atualizar diagnóstico (inativar).
  const updateDiagnosticoGhap = (item) => {
    var obj = {
      idpct: idpaciente,
      idatendimento: idatendimento,
      datainicio: item.datainicio,
      datatermino: moment(),
      idprofissional: 0,
      cid: item.cid,
      descricao: item.descricao,
    }
    axios.post(htmlghapupdatediagnostico + item.id, obj).then(() => {
      getDiagnosticosGhap();
    });
  }

  // PROPOSTAS (ATENDIMENTO).
  // lista de propostas para o atendimento.
  const getPropostasGhap = () => {
    axios.get(htmlghappropostas + idatendimento).then((response) => {
      var x = [];
      x = response.data;
      setlistpropostas(x.rows);
      setarraypropostas(x.rows);
    });
  }
  // inserir proposta.
  const insertPropostaGhap = (datainicio, proposta) => {
    if (listpropostas.filter(item => item.proposta == proposta && item.datatermino == null).length > 0) {
      toast(1, '#ec7063', 'PROPOSTA JÁ CADASTRADA', 3000);
    } else {
      var obj = {
        idpct: idpaciente,
        idatendimento: idatendimento,
        datainicio: moment(datainicio, 'DD/MM/YYYY'),
        datatermino: null,
        proposta: proposta,
        idprofissional: 0,
        status: 0 // 1 = concluído.
      }
      axios.post(htmlghapinsertproposta, obj).then(() => {
        getPropostasGhap();
      });
    }
  }
  // atualizar proposta (checar como concluída).
  const updatePropostaGhapChecar = (item) => {
    var obj = {
      idpct: idpaciente,
      idatendimento: idatendimento,
      datainicio: item.datainicio,
      datatermino: moment(),
      proposta: item.proposta,
      idprofissional: item.idprofissional,
      status: item.status == 1 ? 0 : 1 // 1 = concluído.
    }
    axios.post(htmlghapupdateproposta + item.id, obj).then(() => {
      getPropostasGhap();
    });
  }

  // excluir proposta (inativar).
  const updatePropostaGhapInativar = (item) => {
    var obj = {
      idpct: idpaciente,
      idatendimento: idatendimento,
      datainicio: item.datainicio,
      datatermino: moment(),
      proposta: item.proposta,
      idprofissional: item.idprofissional,
      status: 3 // 3 = cancelada, inativada.
    }
    axios.post(htmlghapupdateproposta + item.id, obj).then(() => {
      getPropostasGhap();
    });
  }

  // PROPOSTAS (ATENDIMENTO).
  // lista de propostas para o atendimento.
  const [listdieta, setlistdieta] = useState([]);
  const getDietaGhap = () => {
    axios.get(htmlghapdietas + idatendimento).then((response) => {
      var x = [];
      x = response.data;
      setlistdieta(x.rows);
      setviadieta(listdieta.map(item => item.via));
      setcabeceira(listdieta.map(item => item.cabeceira));
    });
  }
  // inserir via da dieta e posição da cabeceira.
  const insertDietaGhap = () => {
    if (listdieta.filter(item => item.via == viadieta && item.cabeceira == cabeceira && item.datatermino == null).length > 0) {
      toast(1, '#ec7063', 'VIA DE DIETA JÁ ATIVA', 3000);
    } else {
      var obj = {
        idpct: idpaciente,
        idatendimento: idatendimento,
        datainicio: moment(),
        datatermino: null,
        idprofissional: 0,
        via: viadieta,
        cabeceira: cabeceira,
        infusao: infusaodieta,
        get: getdieta,
      }
      axios.post(htmlghapinsertdieta, obj).then(() => {
        getDietaGhap();
      });
    }
  }

  // atualizar via da dieta e posição da cabeceira (inativa o registro).
  const updateDietaGhap = (item) => {
    var obj = {
      idpct: idpaciente,
      idatendimento: idatendimento,
      datainicio: item.datainicio,
      datatermino: moment(),
      idprofissional: 0,
      via: item.via,
      cabeceira: item.cabeceira,
      infusao: item.infusao,
      get: item.get,
    }
    axios.post(htmlghapupdatedieta + item.id, obj).then(() => {
      getPropostasGhap();
    });
  }

  useEffect(() => {
    createAtendimentoGhap();
    // getAtendimentosGhap();
    getPrecaucoesGhap();
    getAlergiasGhap();
    // getListaDeDiagnosticos();
    getDiagnosticosGhap();
    getPropostasGhap();
    loadInvasoes();
    loadLesoes();
    loadInterconsultas();
    loadOpcoesEscalas();
    loadEscalas();

    freezeScreen(3000);
    setrefreshatendimentos(0);
    // getDadosVitais(idatendimento);
    getBalancoHidrico(idatendimento);
    // carregando dados do paciente e de seu atendimento.
    loadPaciente(idpaciente);
    loadAtendimento(idpaciente);
    loadHistoricoDeAtendimentos();
    // alert(idpaciente);
    // alert(listaatendimentos.filter(item => item.cd_paciente == idpaciente).lenght);
    // updatePrincipal();
    // APT - carregando IVCF:
    setivcf(7);

    // carregando configurações de visualização dos componentes.
    loadSettings();
    // abrindo o prontuário sempre na tela principal.
    setstateprontuario(1);
    // prevenindo a exibição do boneco caso um médico acesse a corrida pela tela/state prescrição.
    setshowinvasoes(0);
    // scroll to top on render (importante para as versões mobile).
    window.scrollTo(0, 0);
    // limpando alertas.
    setalertas([]);
    arrayalertas = [];
    // fechando as visualizações das telas secundárias (melhor aproximação até o momento).
    setviewsettings(0);
    setviewevolucao(0);
    setviewprintevolucao(0);
    setviewprintformulario(0);
    setviewdiagnostico(0);
    setviewproblema(0);
    setviewproposta(0);
    setviewinterconsulta(0);
    setviewlaboratorio(0);
    setviewimagem(0);
    setviewbalanco(0);
    setviewformulario(0);
    setviewprintformulario(0);
    setshowlesoes(0);
    setshowinvasoes(1);
    // resetando estado das scrolls.
    setscrollmenu(0);
    // eslint-disable-next-line
  }, [idpaciente])

  // carregando configurações do banco de dados.
  var x = [0, 1];
  const loadSettings = () => {
    axios.get(html + "/settings").then((response) => {
      x = response.data;
      setsettings(response.data);
      viewSettings(x);
    });
  }
  const viewSettings = (origem) => {
    // esquemas de cores >> 1 = purplescheme, 2 = bluescheme, etc...
    // var paleta = origem.filter(valor => valor.componente == "COLORSCHEME").map(valor => valor.view);
    var paleta = 1;
    setschemecolor(paleta == 1 ? 'purplescheme' : paleta == 2 ? 'bluescheme' : 'ghapscheme');
    setmenuevolucoes(origem.filter(valor => valor.componente == "EVOLUÇÕES").map(valor => valor.view));
    setmenudiagnosticos(origem.filter(valor => valor.componente == "DIAGNÓSTICOS").map(valor => valor.view));
    setmenuproblemas(origem.filter(valor => valor.componente == "PROBLEMAS").map(valor => valor.view));
    setmenupropostas(origem.filter(valor => valor.componente == "PROPOSTAS").map(valor => valor.view));
    setmenuinterconsultas(origem.filter(valor => valor.componente == "INTERCONSULTAS").map(valor => valor.view));
    setmenulaboratorio(origem.filter(valor => valor.componente == "LABORATÓRIO").map(valor => valor.view));
    setmenuimagem(origem.filter(valor => valor.componente == "IMAGEM").map(valor => valor.view));
    setmenuprescricao(origem.filter(valor => valor.componente == "PRESCRIÇÃO").map(valor => valor.view));
    setmenuformularios(origem.filter(valor => valor.componente == "FORMULÁRIOS").map(valor => valor.view));
    setcardinvasoes(origem.filter(valor => valor.componente == "INVASÕES").map(valor => valor.view));
    setcardlesoes(origem.filter(valor => valor.componente == "LESÕES").map(valor => valor.view));
    setcardstatus(origem.filter(valor => valor.componente == "STATUS").map(valor => valor.view));
    setcardalertas(origem.filter(valor => valor.componente == "ALERTAS").map(valor => valor.view));
    setcardprecaucao(origem.filter(valor => valor.componente == "PRECAUÇÃO").map(valor => valor.view));
    setcardultimaevolucao(origem.filter(valor => valor.componente == "ÚLTIMA EVOLUÇÃO").map(valor => valor.view));
    setcarddiagnosticos(origem.filter(valor => valor.componente == "DIAGNÓSTICO").map(valor => valor.view));
    setcardhistoricoatb(origem.filter(valor => valor.componente == "HISTÓRICO DE ANTIBIÓTICOS").map(valor => valor.view));
    setcardhistoricoatendimentos(origem.filter(valor => valor.componente == "HISTÓRICO DE ATENDIMENTOS").map(valor => valor.view));
    setcardanamnese(origem.filter(valor => valor.componente == "ANAMNESE").map(valor => valor.view));
  }

  useEffect(() => {
    viewSettings(settings);
  }, [settings])

  useEffect(() => {
    setTimeout(() => {
      loadOpcoesEscalas();
      loadEscalas();
    }, 2000);
  }, [showescala])

  const freezeScreen = (time) => {
    setloadprincipal(1);
    //document.getElementById("loadprincipal").style.display = 'flex';
    setTimeout(() => {
      setloadprincipal(0);
      //document.getElementById("loadprincipal").style.display = 'none';
    }, time);
  }

  // animação para carregamento da tela principal.
  const [loadprincipal, setloadprincipal] = useState(1);
  const LoadPrincipal = useCallback(() => {
    return (
      <div id="loadprincipal"
        // className="conteudo"
        className="fade-in"
        style={{
          display: loadprincipal == 1 ? 'flex' : 'none',
          flexDirection: 'column',
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba( 255, 255, 255, 1)', opacity: 1, borderRadius: 0, zIndex: 999, margin: 0,
          alignItems: 'center', justifyContent: 'center', alignSelf: 'center',
        }}>
        <div className="pulsarlogo" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <LogoInverted height={100} width={100}></LogoInverted>
        </div>
      </div>
    )
  }, [loadprincipal]);

  // funções deflagradas para alimentação da tela principal.
  const updatePrincipal = (idpaciente) => {
    // carregando invasões.
    loadInvasoes();
    // carregando lesões de pressão.
    loadLesoes();
    // carregando últimos parâmetros ventilatórios.
    loadVm();
    // carregando histórico de antibióticos.
    setTimeout(() => {
      getAtb();
    }, 5000);
    // renderizando as escalas sensoriais.
    setViewglasgow(0);
    setViewrass(0);
    setViewramsay(0);
    if (glasgow != '') {
      setViewglasgow(1);
    }
    if (rass != '') {
      setViewrass(1);
    }
    if (ramsay != '') {
      setViewramsay(1);
    }
    // calculando o bh acumulado.
    loadBhacumulado();
    // carregando as listas.
    loadEvolucoes();
    // loadDiagnosticos(idpaciente);
    loadProblemas();
    loadInterconsultas();
    loadLaboratorio();
    loadImagem();
    loadBalancos();
    loadFormularios();
    // carregando listas de ganhos e perdas (para balanço hídrico).
    getSomaGanhos();
    getSomaPerdas();
    getDiurese12h();
    getBh12h();
    getBhAcumulado();
    // carregando os antibióticos.
    getAtb();
    // carregando os últimos valores válidos para Braden e Morse.
    loadLastBraden();
    loadLastMorse();
    if (stateprontuario === 9 && (tipousuario === 1 || tipousuario === 2)) {
      setshowlesoes(0);
      setshowinvasoes(0);
    } else if (stateprontuario === 10 && tipousuario === 4) {
      setshowlesoes(0);
      setshowinvasoes(0);
    } else {
    }
  }

  // carregando os alertas.
  const loadAlertas = () => {
    setalertas([]);
    arrayalertas = [];
    // carregando os alertas.
    alertSepse();
    alertDadosVitais();
    alertCulturas();
    alertDispositivos();
    alertEvacuacoes();
    setTimeout(() => {
      setalertas(arrayalertas);
    }, 1000);
  }

  /*
  RENDERIZAÇÃO DOS COMPONENTES PERMANENTES DA TELA CORRIDA:
  - Header;
  - Identificação do paciente.
  - Menu para acesso às telas secundárias;
  - Widget de invasões (boneco) e respectivos menus;
  - Tela principal;
  */

  // botão para acesso às configurações de tela / settings.
  function BtnSettings() {
    return (
      <button
        className="grey-button"
        title="CONFIGURAÇÕES."
        onClick={(e) => { setviewsettings(1); e.stopPropagation() }}
        style={{
          display: tipousuario == 2 ? 'flex' : 'none',
          minWidth: 50,
          minHeight: 50,
          width: 50,
          height: 50,
          marginLeft: 2.5, marginRight: 2.5,
          padding: 5,
        }}
      >
        <img
          alt=""
          src={settingsimg}
          style={{
            margin: 0,
            height: 20,
            width: 20,
          }}
        ></img>
      </button>
    )
  }

  // Representação gráfica do step atual do paciente.
  const dataChartStep = {
    datasets: [
      {
        data: [5, 10],
        backgroundColor: ['#ec7063', '#52be80'],
        borderColor: '#ffffff',
        hoverBorderColor: ['#ffffff', '#ffffff'],
      },
    ],
  }

  // HISTÓRICO DE PACIENTES.
  function HistoricoDeAtendimentos() {
    return (
      <div
        id="historicodeatendimentos"
        className="scrollhorizontal">
        <div className="buttons">
          {historicodeatendimentos.map(item =>
            <div className={item.dt_hr_atendimento !== null ? "red-button" : "blue-button"} style={{ padding: 10 }}>
              {moment(item.dt_hr_atendimento).format('DD/MM/YYYY')}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Mastercard (car que expõe todos os dados mais importantes do paciente. Diferencial do Pulse).
  const [expandmastercard, setexpandmastercard] = useState(0);
  function Mastercard() {
    return (
      <div id="mastercard" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        <CardDiasdeInternacao></CardDiasdeInternacao>
        <CardAlertas></CardAlertas>
        <CardPrecaucao></CardPrecaucao>
        <CardAlergias></CardAlergias>
        <CardGestaoDeRiscos></CardGestaoDeRiscos>
        <CardIVCF></CardIVCF>
      </div>
    )
  }
  // IDENTIFICAÇÃO DO PACIENTE.
  // gerando qrcode da idpaciente.
  var QRCode = require('qrcode.react');
  const [showdetalhes, setshowdetalhes] = useState(0);
  function Paciente() {
    return (
      <div
        id="identificação"
        className="paciente"
      >
        <div id="IDENTIFICAÇÃO" style={{
          display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', width: '100vw',
          verticalAlign: 'center', alignItems: 'center',
        }}>
          <img
            alt=""
            src={foto}
            onClick={() => setshowqr(1)}
            style={{
              height: '80%',
              padding: 0,
              margin: 5,
              marginLeft: 10,
              borderRadius: 5,
            }}
          ></img>
          <ShowQr></ShowQr>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', width: '100%' }}>
              <button
                className="grey-button"
                style={{
                  display: tipounidade != 4 ? 'flex' : 'none',
                  textTransform: 'uppercase',
                  width: window.innerWidth > 400 ? 80 : 50,
                  minWidth: window.innerWidth > 400 ? 80 : 50,
                  height: window.innerWidth > 400 ? 65 : 50,
                  minHeight: window.innerWidth > 400 ? 65 : 50,
                  marginRight: 5, marginLeft: 10,
                  backgroundColor: 'grey'
                }}
                id="inputBox"
                title={"BOX"}
              >
                {box}
              </button>

              <div id="round gráfico"
                style={{
                  display: window.innerWidth > 400 ? 'flex' : 'none',
                  margin: 2.5, position: 'relative', height: 65,
                }}>
                <Doughnut
                  data={dataChartStep}
                  width={65}
                  height={65}
                  plugins={ChartDataLabels}
                  options={{
                    cutoutPercentage: 40,
                    plugins: {
                      legend: {
                        display: false
                      },
                      datalabels: {
                        display: false
                      }
                    },
                    tooltips: {
                      enabled: false,
                    },
                    hover: { mode: null },
                    elements: {
                      arc: {
                        hoverBorderColor: '#E1E5F2',
                        borderColor: '#E1E5F2',
                        borderWidth: 0,
                        width: 25
                      },
                    },
                    animation: {
                      duration: 0,
                    },
                    title: {
                      display: false,
                    },
                    legend: {
                      display: false,
                      position: 'bottom',
                    },
                    maintainAspectRatio: true,
                    responsive: false,
                  }}
                />
                <div
                  id="steptext"
                  title="STEP ATUAL."
                  className="title5" style={{
                    margin: 0, padding: 0,
                    fontSize: 12,
                    position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
                    height: 65,
                    width: 65
                  }}>
                  01
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', width: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', verticalAlign: 'center' }}>
                  <button
                    className="rowitem"
                    style={{
                      marginLeft: tipounidade != 4 ? 0 : 5,
                      marginRight: 0,
                      marginBottom: 0,
                      paddingBottom: 0,
                      color: '#ffffff',
                      alignSelf: 'flex-start',
                      textAlign: 'left',
                      fontSize: window.innerWidth > 400 ? 18 : 14,
                    }}
                    id="inputNome"
                  >
                    {nomepaciente}
                  </button>
                  <div style={{ position: 'relative' }}>
                    <img
                      id="info"
                      // onMouseOver={() => document.getElementById("info").style.opacity = 1}
                      onClick={(e) => {
                        setshowdetalhes(1);
                        e.stopPropagation();
                      }}
                      alt=""
                      src={info}
                      title="INFORMAÇÕES DO PACIENTE"
                      style={{
                        position: 'relative',
                        height: 20,
                        padding: 0,
                        margin: 5, marginTop: 6,
                        borderRadius: 5,
                        opacity: 0.8
                      }}
                    >
                    </img>
                    <img
                      id="btnhistoricodeatendimentos"
                      onClick={() => document.getElementById("historicodeatendimentos").classList.toggle("scrollhorizontalhover")}
                      alt=""
                      title="HISTÓRICO DE ATENDIMENTOS"
                      src={historico}
                      style={{
                        position: 'relative',
                        height: 20,
                        padding: 0,
                        margin: 5, marginTop: 6,
                        borderRadius: 5,
                        opacity: 0.8
                      }}
                    >
                    </img>
                    <DetalhesPaciente></DetalhesPaciente>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', padding: 5 }}>
                  <div
                    className="rowitem"
                    style={{
                      margin: 2.5,
                      padding: 0,
                      color: '#ffffff',
                      alignSelf: 'flex-start',
                      justifyContent: 'row',
                    }}
                  >
                    <div id="idade">
                      {moment().diff(moment(dn, 'DD/MM/YYYY'), 'years') < 2 ? + moment().diff(moment(dn, 'DD/MM/YYYY'), 'years') + ' ANO' : moment().diff(moment(dn, 'DD/MM/YYYY'), 'years') + ' ANOS'}
                    </div>
                    <div id="separador - bolinha 1"
                      style={{ marginLeft: 15, marginRight: 15 }}>
                      {'•'}
                    </div>
                    <div id="tempo de internação"
                      title="TEMPO DE INTERNAÇÃO (DIAS)"
                      style={{
                        color:
                          moment().diff(moment(datainternacao), 'days') < 31 ? "#52be80" :
                            moment().diff(moment(datainternacao), 'days') > 30 && moment().diff(moment(datainternacao), 'days') < 60 ? "yellow" :
                              "#ec7063",
                      }}
                    >
                      {moment().diff(moment(datainternacao), 'days') > 1 ? moment().diff(moment(datainternacao), 'days') + ' DIAS DE INTERNAÇÃO.' : moment().diff(moment(datainternacao), 'days') + ' DIA DE INTERNAÇÃO.'}
                    </div>
                    <div id="separador - bolinha 1"
                      style={{ marginLeft: 15, marginRight: 15 }}>
                      {'•'}
                    </div>
                    <div
                      title="linha de cuidado"
                      style={{
                        color:
                          linhadecuidado == 1 ? "#52be80" : linhadecuidado == 2 ? "#f5b041" : "#ec7063",
                      }}
                    >
                      {linhadecuidado == 1 ? 'REABILITAÇÃO' : linhadecuidado == 2 ? 'PALIATIVO' : 'PACIENTE CRÔNICO'}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: window.innerWidth > 400 ? 'none' : 'flex',
                    bottom: 10, right: 10,
                    flexDirection: 'row',
                    alignSelf: 'flex-end', marginRight: 5,
                  }}
                >
                  <Link
                    to={tipounidade == 4 ? "/ambulatorio" : "/pacientes"}
                    className="grey-button"
                    title="VOLTAR."
                    style={{
                      minWidth: 40,
                      minHeight: 40,
                      width: 40,
                      height: 40,
                      margin: 2.5,
                      padding: 5,
                    }}
                  >
                    <img
                      alt=""
                      src={back}
                      style={{
                        margin: 0,
                        height: 20,
                        width: 20,
                      }}
                    ></img>
                  </Link>
                  <Link
                    to="/"
                    className="grey-button"
                    title="FAZER LOGOFF."
                    style={{
                      display: 'flex',
                      minWidth: 40,
                      minHeight: 40,
                      width: 40,
                      height: 40,
                      margin: 2.5,
                      padding: 5,
                    }}
                  >
                    <img
                      alt=""
                      src={logoff}
                      style={{
                        margin: 0,
                        height: 20,
                        width: 20,
                      }}
                    ></img>
                  </Link>
                </div>

              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            display: window.innerWidth > 400 ? 'flex' : 'none',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-end',
            margin: 10,
          }}
        >
          <div
            className="title2"
            style={{ color: '#ffffff', textAlign: 'right' }}
          >
            {'OLÁ, ' + nomeusuario}
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            <Link
              to={tipounidade == 4 ? "/ambulatorio" : "/pacientes"}
              className="grey-button"
              title="VOLTAR."
              style={{
                width: 50,
                height: 50,
                margin: 2.5,
                padding: 20,
              }}
            >
              <img
                alt=""
                src={back}
                style={{
                  margin: 5,
                  height: 25,
                  width: 25,
                }}
              ></img>
            </Link>
            <BtnSettings></BtnSettings>
            <Link
              to="/"
              className="grey-button"
              title="FAZER LOGOFF."
              style={{
                display: 'flex',
                width: 50,
                height: 50,
                margin: 2.5,
                padding: 20,
              }}
            >
              <img
                alt=""
                src={logoff}
                style={{
                  margin: 5,
                  height: 25,
                  width: 25,
                }}
              ></img>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  function DetalhesPaciente() {
    return (
      <div className="detalhes fade-in"
        onClick={(e) => { setshowdetalhes(0); e.stopPropagation() }}
        onMouseLeave={() => setshowdetalhes(0)}
        style={{
          display: showdetalhes == 1 ? 'flex' : 'none',
        }}
      >
        <div className="title5" style={{ fontSize: 12, textAlign: 'left' }}>{'PRONTUÁRIO: ' + idpaciente}</div>
        <div className="title5" style={{ fontSize: 12, textAlign: 'left' }}>{'ATENDIMENTO: ' + idatendimento}</div>
        <div className="title5" style={{ fontSize: 12, textAlign: 'left' }}>{'DATA DA INTERNAÇÃO: ' + moment(datainternacao).format('DD/MM/YY - HH:MM')}</div>
        <div className="title5" style={{ fontSize: 12, textAlign: 'left' }}>{'CONVÊNIO: ' + convenio}</div>
        <div className="title5" style={{ fontSize: 12, textAlign: 'left' }}>{'DN: ' + dn}</div>
        <div className="title5" style={{ fontSize: 12, textAlign: 'left' }}>{'NOME DA MÃE: ' + nomemae}</div>
        <div className="title5" style={{ fontSize: 12, textAlign: 'left' }}>{'CONTATO: ' + contato}</div>
        <div className="title5" style={{ fontSize: 12, textAlign: 'left' }}>{'ENDEREÇO: ' + endereço}</div>
      </div>
    )
  }

  // importando informações do último atendimento, caso o sistema identifique uma história em branco.
  const getLastAtendimento = (idpcte, box, admissao, dn) => {
    axios.get(html + "/atendimentos").then((response) => {
      var x = [0, 1];
      x = response.data;
      var y = [0, 1];
      // filtrando o último atendimento.
      y = x.filter((item) => item.idpaciente == idpcte && item.ativo == 0).sort(((a, b) => a.id > b.id ? 1 : -1)).slice(-1);
      // ativo 0 = atendimento inativo; ativo = 1 atendimento ativo e admissão não preenchida; ativo = 2 atendimento ativo e admissão preenchida.
      if (y.length > 0 && statusatendimento == 1) {
        // aqui os dados da admissão anterior são importados. O médico deve salvar o registro do atendimento atual, que terá seu valor de ativo modificado para 2. Em seguida, o sistema gera o relatório de admissão.
        var peso = y.map((item) => item.peso);
        var altura = y.map((item) => item.altura);
        var antecedentes = y.map((item) => item.antecedentes);
        var alergias = y.map((item) => item.alergias);
        var medicacoes = y.map((item) => item.medicacoes);
        var exames = y.map((item) => item.exames);
        var historia = y.map((item) => item.historia);
        var assistente = y.map((item) => item.assistente);
        var obj = {
          idpaciente: idpcte,
          hospital: nomehospital,
          unidade: nomeunidade,
          box: box,
          admissao: admissao,
          nome: nomepaciente,
          dn: dn,
          peso: peso,
          altura: altura,
          antecedentes: antecedentes,
          alergias: alergias,
          medicacoes: medicacoes,
          exames: exames,
          historia: historia,
          status: 3, // estável.
          ativo: 1, // atendimento novo ativo, dados de anamnese copiados mas não confirmados.
          classificacao: classificacao,
          descritor: descritor,
          precaucao: 1, // precaução padrão.
          assistente: assistente !== 'SEM MÉDICO ASSISTENTE' ? assistente : 'SEM MÉDICO ASSISTENTE',
        };
        axios.post(html + '/updateatendimento/' + idatendimento, obj).then(() => {
          toast(1, '#52be80', 'INFORMAÇÕES DO ÚLTIMO ATENDIMENTO IMPORTADAS PARA O ATENDIMENTO ATUAL. FAVOR ATUALIZAR.', 3000);
          setTimeout(() => {
            viewUpdateAtendimento();
          }, 3500);
        });
      } else {
      }
    });
  }

  // COMPONENTES EXCLUSIVOS DA VERSÃO MOBILE:
  const [showmenu, setshowmenu] = useState(0);
  function ButtonMobileMenu() {
    return (
      <button
        className="grey-button"
        id="BTN MENU MOBILE"
        onClick={(e) => { showMenuMobile(); e.stopPropagation() }}
        style={{ zIndex: 0 }}
      >
        <img
          alt=""
          src={menu}
          style={{
            margin: 10,
            height: 30,
            width: 30,
          }}
        ></img>
      </button>
    )
  }

  const showMenuMobile = () => {
    window.scrollTo(0, 0);
    setshowmenu(1);
  }

  function MobileMenu() {
    if (showmenu === 1) {
      return (
        <div
          className="menucover"
        >
          <div
            className="grey-button"
            style={{
              padding: 10,
              backgroundColor: 'grey'
            }}
          >
            <button
              className="blue-button"
              onClick={() => clickPrincipal()}
              style={{
                width: 200,
                height: 50,
                margin: 5,
                padding: 0,
              }}
            >
              PRINCIPAL
            </button>
            <button
              className="blue-button"
              onClick={() => clickPlanoTerapeutico()}
              style={{
                width: 200,
                height: 50,
                margin: 5,
                padding: 0,
              }}
            >
              PLANO TERAPÊUTICO
            </button>
            <button
              className="blue-button"
              onClick={() => clickEvoluções()}
              style={{
                display: menuevolucoes == 1 ? 'flex' : 'none',
                width: 200,
                height: 50,
                margin: 5,
                padding: 0,
              }}
            >
              EVOLUÇÕES
            </button>
            <button
              className="blue-button"
              onClick={() => clickDiagnosticos()}
              style={{
                width: 200,
                height: 50,
                margin: 5,
                padding: 0,
              }}
            >
              DIAGNÓSTICOS
            </button>
            <button
              className="blue-button"
              onClick={() => clickPropostas()}
              style={{
                width: 200,
                height: 50,
                margin: 5,
                padding: 0,
              }}
            >
              PROPOSTAS
            </button>
            <button
              className="blue-button"
              onClick={() => clickLaboratorio()}
              style={{
                width: 200,
                height: 50,
                margin: 5,
                padding: 0,
              }}
            >
              LABORATÓRIO
            </button>
            <button
              className="blue-button"
              onClick={() => clickImagem()}
              style={{
                width: 200,
                height: 50,
                margin: 5,
                padding: 0,
              }}
            >
              IMAGEM
            </button>
          </div>
        </div>
      )
    } else {
      return null;
    }
  }

  // PAINEL PRINCIPAL.
  function Principal() {
    if (stateprontuario === 1) {
      return (
        <div id="painel principal"
          className="scroll"
          style={{
            scrollBehavior: 'smooth',
            alignItems: 'center', flexDirection: 'row', backgroundColor: 'transparent',
            borderColor: 'transparent',
            flexWrap: 'wrap', justifyContent: 'space-evenly'
          }}
        >
          <ViewPrecaucoesOptions></ViewPrecaucoesOptions>

          <CardDiasdeInternacao></CardDiasdeInternacao>
          <CardStatus></CardStatus>
          <CardAlertas></CardAlertas>
          <CardPrecaucao></CardPrecaucao>

          <CardAlergias></CardAlergias>
          <AlergiaField></AlergiaField>
          <CardGestaoDeRiscos></CardGestaoDeRiscos>
          <CardIVCF></CardIVCF>

          <CardControles></CardControles>

          <CardNutricao></CardNutricao>
          <CardInvasoes></CardInvasoes>
          <CardLesoes></CardLesoes>
          <CardVm></CardVm>

          <CardEvolucoes></CardEvolucoes>
          <ViewCidOptions></ViewCidOptions>
          <CardDiagnosticos></CardDiagnosticos>

          <CardAntibioticos></CardAntibioticos>
          <CardInternacoes></CardInternacoes>

          <div
            id="ANAMNESE"
            className="secondary"
            style={{
              display: cardanamnese == 1 ? 'flex' : 'none',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                margin: 0,
                padding: 0,
                justifyContent: 'center',
              }}
            >
              <div style={{ padding: 5, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div className="title2center" style={{ color: '#8f9bbc' }}>
                  {window.innerWidth > 400 ? 'ANTECEDENTES PESSOAIS' : 'ANTECEDENTES'}
                </div>
                <textarea
                  className="textarea"
                  onKeyUp={() => {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => {
                      setantecedentes(document.getElementById("inputAp").value);
                      updateAtendimento();
                    }, 2000);
                  }}
                  style={{ width: window.innerWidth < 400 ? '40vw' : 'calc(35vw - 20px)', height: 140 }}
                  id="inputAp"
                  title="ANTECEDENTES PESSOAIS."
                >
                  {antecedentes}
                </textarea>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                margin: 0,
                justifyContent: 'center',
              }}
            >
              <div style={{ padding: 5, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div className="title2center" style={{ color: '#8f9bbc' }}>
                  {window.innerWidth > 400 ? 'MEDICAÇÕES DE USO PRÉVIO' : 'MEDICAÇÕES'}
                </div>
                <textarea
                  className="textarea"
                  onKeyUp={() => {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => {
                      setantecedentes(document.getElementById("inputMedprev").value);
                      updateAtendimento();
                    }, 2000);
                  }}
                  style={{ width: window.innerWidth < 400 ? '40vw' : 'calc(35vw - 20px)', height: 140 }}
                  id="inputMedprev"
                  title="MEDICAÇÕES PRÉVIAS."
                >
                  {medicacoes}
                </textarea>
              </div>
              <div style={{ padding: 5, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div className="title2center" style={{ color: '#8f9bbc' }}>EXAMES PRÉVIOS</div>
                <textarea
                  className="textarea"
                  onKeyUp={() => {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => {
                      setantecedentes(document.getElementById("inputExprev").value);
                      updateAtendimento();
                    }, 2000);
                  }}
                  style={{ width: window.innerWidth < 400 ? '40vw' : 'calc(35vw - 20px)', height: 140 }}
                  id="inputExprev"
                  title="EXAMES PRÉVIOS."
                >
                  {exames}
                </textarea>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                margin: 0,
                padding: 5,
                justifyContent: 'center',
              }}
            >
              <div className="title2center" style={{ color: '#8f9bbc' }}>HISTÓRIA DA DOENÇA ATUAL</div>
              <textarea
                className="textarea"
                onKeyUp={() => {
                  clearTimeout(timeout);
                  timeout = setTimeout(() => {
                    setantecedentes(document.getElementById("inputHda").value);
                    updateAtendimento();
                  }, 2000);
                }}
                style={{ width: window.innerWidth < 400 ? '80vw' : 'calc(70vw - 20px)', height: 140 }}
                id="inputHda"
                title="HISTÓRIA DA DOENÇA ATUAL."
              >
                {historia}
              </textarea>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  // carregando os antibióticos registrados em cada prescrição do atendimento.
  const [atblist, setatblist] = useState([]);
  const getAtb = () => {
    axios.get(html + "/atblist/'" + idatendimento + "'").then((response) => {
      setatblist(response.data);
    });
  }
  // EXIBIR LISTA DE ANTIBIÓTICOS USADOS.
  function CardAntibioticos() {
    return (
      <div
        className="pulsewidgetscroll"
        id="LISTA DE ANTIBIÓTICOS PRESCRITOS"
        style={{ display: cardhistoricoatb == 1 ? 'flex' : 'none', }}
        onClick={() => document.getElementById("LISTA DE ANTIBIÓTICOS PRESCRITOS").classList.toggle("pulsewidgetscrollmax")}
      >
        <div className="title4 pulsewidgettitle">{'HISTÓRICO DE ANTIBIÓTICOS'}</div>
        <div className="pulsewidgetcontent" style={{ display: atblist.length > 0 ? 'flex' : 'none' }}>
          {atblist.map((item) => (
            <div
              className="title1"
              style={{
                display: atblist.filter(valor => valor.grupo == "ANTIBIOTICOS" && valor.idprescricao == item.id).length > 0 ? 'flex' : 'none',
              }}
            >
              {item.datainicio.substring(0, 8)}
              <div>
                {atblist.map((value) => (
                  <p
                    key={value.id}
                    id="item de antibiótico."
                    style={{
                      display: value.grupo == 'ANTIBIOTICOS' && value.idprescricao == item.id ? 'flex' : 'none',
                      paddingRight: window.innerWidth > 800 ? 5 : 0,
                      margin: 0,
                      marginTop: 2.5,
                      marginBottom: 5,
                      marginRight: 5,
                      opacity: 1.0,
                      width: '100%',
                      padding: 5,
                    }}
                  >
                    {value.farmaco}
                  </p>
                ))
                }
              </div>
            </div>
          ))
          }
        </div>
        <div className="pulsewidgetcontent"
          style={{
            display: atblist.length < 1 ? 'flex' : 'none',
            color: '#8f9bbc',
            fontWeight: 'bold',
            fontSize: 16,
          }}>
          SEM REGISTROS DE ANTIBIÓTICOS
        </div>
      </div>
    )
  }

  // card status.
  function CardStatus() {
    return (
      <div
        className="pulsewidgetstatic"
        id="STATUS"
        title="STATUS DO PACIENTE."
        onClick={tipousuario != 4 ? () => showChangeStatus() : null} // técnico
        style={{
          display: cardstatus == 1 ? 'flex' : 'none',
          backgroundColor: status == 3 ? '#52be80' : status == 2 ? '#f5b041' : status == 1 ? '#ec7063' : status == 0 ? 'grey' : 'purple'
        }}
      >
        <text className="title5">
          {status == 3 ? 'STATUS: \nESTÁVEL' : status == 2 ? 'STATUS: \nALERTA' : status == 1 ? 'STATUS: \nINSTÁVEL' : status == 0 ? 'STATUS: \nCONFORTO' : 'STATUS: \nINDEFINIDO'}
        </text>
      </div>
    )
  }

  // componente para alteração do status.
  const [viewstatus, setViewstatus] = useState(0);
  function ChangeStatus() {
    if (viewstatus === 1) {
      return (
        <div
          className="menucover"
        >
          <div>
            <div
              className="menucontainer" style={{ padding: 20 }}
            >
              <label
                className="title2"
                style={{ marginTop: 0, marginBottom: 15 }}
              >
                ATUALIZAR STATUS
              </label>
              <div
                id="STATUS DO PACIENTE."
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  margin: 5,
                }}
              >
                <div
                  class="radio-toolbar"
                  style={{
                    display: 'flex',
                    flexDirection: window.innerWidth > 800 ? 'row' : 'column',
                    marginTop: 0,
                    marginBottom: 0,
                  }}
                >
                  <input
                    type="radio"
                    id="radio1"
                    name="status"
                    value="ESTÁVEL"
                    onClick={() => changeStatus(3)}
                  ></input>
                  <label for="radio1">ESTÁVEL</label>
                  <input
                    type="radio"
                    id="radio2"
                    name="status"
                    value="ALERTA"
                    onClick={() => changeStatus(2)}
                  ></input>
                  <label for="radio2">ALERTA</label>
                  <input
                    type="radio"
                    id="radio3"
                    name="status"
                    value="INSTÁVEL"
                    onClick={() => changeStatus(1)}
                  ></input>
                  <label for="radio3">INSTÁVEL</label>
                  <input
                    type="radio"
                    id="radio4"
                    name="status"
                    value="INSTÁVEL"
                    onClick={() => changeStatus(0)}
                  ></input>
                  <label for="radio4">CONFORTO</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  const showChangeStatus = () => {
    window.scrollTo(0, 0);
    setViewstatus(1);
  }

  var stat = status;
  const changeStatus = (value) => {
    document.body.style.overflow = null;
    setstatus(value);
    stat = value;
    updateAtendimento();
    setViewstatus(0);
  }

  // card precaução.
  function CardPrecaucao() {
    return (
      <div
        id="cardprecaucao"
        className="pulsewidgetscroll"
        title="PRECAUÇÃO OU ISOLAMENTO DE CONTATO."
        onClick={() => document.getElementById("cardprecaucao").classList.toggle("pulsewidgetscrollmax")}
        style={{
          display: cardprecaucao == 1 ? 'flex' : 'none',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          backgroundColor: ghapprecaucoes.length > 0 ? '#ec7063' : '#52be80',
          borderColor: ghapprecaucoes.length > 0 ? '#ec7063' : '#52be80'
        }}
      >
        <div className="pulsewidgettitle"
          style={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center', fontSize: 16 }}>
          {'PRECAUÇÕES'}
        </div>

        <div style={{ display: ghapprecaucoes.length > 0 ? 'none' : 'flex' }}>
          <div className="pulsewidgetcontent">
            <div
              style={{
                display: 'flex',
                color: '#ffffff',
                fontWeight: 'bold', textAlign: 'center', fontSize: 14,
                marginBottom: 10
              }}>
              {'SEM REGISTROS DE PRECAUÇÕES'}
            </div>
          </div>
        </div>

        <div id="nivel1" style={{ display: ghapprecaucoes.length < 1 ? 'none' : 'flex', width: '100%' }}>
          <div id="nivel2" className="pulsewidgetcontent" >
            <div style={{
              display: 'flex',
              flexDirection: 'column', justifyContent: 'center',
              marginBottom: 10,
              paddingRight: 15,
              width: '100%'
            }}>
              {ghapprecaucoes.map(item => (
                <div className="row"
                  style={{
                    display: 'flex', flexDirection: 'row',
                    backgroundColor:
                      item.idprecaucao == 1 ? '#E67E22' : // contato (laranja). 
                        item.idprecaucao == 2 ? '#2471A3' : // aerossol (azul escuro). 
                          item.idprecaucao == 3 ? '#85C1E9' : // gotículas
                            item.idprecaucao == 4 ? '#F8C471' : // padrão (amarela).
                              item.idprecaucao == 5 ? '#ABEBC6' : // covid 19 (verde limão).
                                item.idprecaucao == 6 ? '#AF7AC5 ' : // kcp/vre (roxo).
                                  '#D5F5E3', // monitoramento de covid-19.
                    padding: 10,
                    width: '100%',
                    opacity: item.datatermino == null ? 1 : 0.5
                  }}
                  onMouseEnter={() => document.getElementById("btndeleteprecaucao").style.opacity = 1}
                  onMouseLeave={() => document.getElementById("btndeleteprecaucao").style.opacity = 0}
                >
                  <div
                    title={
                      item.datatermino == null ?
                        "REGISTRADO POR: " + item.idprofissional + ", EM " + moment(item.datainicio).format('DD/MM/YY') :
                        "REGISTRADO POR: " + item.idprofissional + ", EM " + moment(item.datainicio).format('DD/MM/YY') +
                        ". ENCERRADO POR " + item.idprofissional + ", EM " + moment(item.datatermino).format('DD/MM/YY') + '.'
                    }
                    className="title2center"
                    style={{
                      color: '#ffffff', opacity: item.datatermino == null ? 1 : 0.5,
                      width: '100%'
                    }}>
                    {item.nome}
                  </div>
                  <button id="btndeleteprecaucao" className="animated-red-button"
                    style={{ display: item.datatermino == null ? 'flex' : 'none' }}
                  >
                    <img
                      alt=""
                      src={deletar}
                      onClick={(e) => { updatePrecaucaoGhap(item); e.stopPropagation() }}
                      style={{
                        margin: 10,
                        height: 30,
                        width: 30,
                      }}
                    ></img>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pulsewidgetcontent">
          <button
            className="blue-button" style={{ width: 50, height: 50, alignSelf: 'center' }}
            onClick={() => { getPrecaucoesOptionsGhap(); setviewprecaucoesoptions(1) }}
          >
            +
          </button>
        </div>
      </div>
    )
  }
  // componente para seleção das opções de precaução.
  const [viewprecaucoesoptions, setviewprecaucoesoptions] = useState(0);
  function ViewPrecaucoesOptions() {
    return (
      <div className="menucover"
        onClick={() => setviewprecaucoesoptions(0)}
        style={{ display: viewprecaucoesoptions == 1 ? 'flex' : 'none' }}>
        <div
          className="menucontainer" style={{ padding: 20 }}
        >
          {precaucoesoptions.map(item => (
            <div
              className="blue-button"
              onClick={() => {
                setidprecaucao(item.id);
                setnomeprecaucao(item.nome);
                insertPrecaucaoGhap(item.id, item.nome);
              }}
              style={{ padding: 10, margin: 5, width: 200 }}
            >
              {item.nome}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // card alergias.
  function CardAlergias() {
    return (
      <div
        id="cardalergia"
        className="pulsewidgetscroll"
        title="ALERGIAS."
        onClick={() => document.getElementById("cardalergia").classList.toggle("pulsewidgetscrollmax")}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          backgroundColor: ghapalergias.length > 0 ? '#ec7063' : '#52be80',
          borderColor: ghapalergias.length > 0 ? '#ec7063' : '#52be80'
        }}
      >
        <div className="pulsewidgettitle"
          style={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center', fontSize: 16 }}>
          {'ALERGIAS'}
        </div>

        <div style={{ display: ghapalergias.length > 0 ? 'none' : 'flex' }}>
          <div className="pulsewidgetcontent">
            <div
              style={{
                display: 'flex',
                color: '#ffffff',
                fontWeight: 'bold', textAlign: 'center', fontSize: 14,
                marginBottom: 10
              }}>
              {'SEM REGISTROS DE ALERGIAS'}
            </div>
          </div>
        </div>

        <div id="nivel1" style={{ display: ghapalergias.length < 1 ? 'none' : 'flex', width: '100%' }}>
          <div id="nivel2" className="pulsewidgetcontent" >
            <div style={{
              display: 'flex',
              flexDirection: 'column', justifyContent: 'center',
              marginBottom: 10,
              paddingRight: 15,
              width: '100%'
            }}>
              {ghapalergias.map(item => (
                <div className="row"
                  style={{
                    display: 'flex', flexDirection: 'row',
                    backgroundColor: '#F1948A',
                    padding: 10,
                    width: '100%',
                    opacity: item.datatermino == null ? 1 : 0.5
                  }}
                  onMouseEnter={() => document.getElementById("btndeletealergia").style.opacity = 1}
                  onMouseLeave={() => document.getElementById("btndeletealergia").style.opacity = 0}
                >
                  <div
                    title={
                      item.datatermino == null ?
                        "REGISTRADO POR: " + item.idprofissional + ", EM " + moment(item.datainicio).format('DD/MM/YY') :
                        "REGISTRADO POR: " + item.idprofissional + ", EM " + moment(item.datainicio).format('DD/MM/YY') +
                        ". ENCERRADO POR " + item.idprofissional + ", EM " + moment(item.datatermino).format('DD/MM/YY') + '.'
                    }
                    className="title2center"
                    style={{
                      color: '#ffffff', opacity: item.datatermino == null ? 1 : 0.5,
                      width: '100%'
                    }}>
                    {item.nome}
                  </div>
                  <button id="btndeletealergia" className="animated-red-button"
                    style={{ display: item.datatermino == null ? 'flex' : 'none' }}
                  >
                    <img
                      alt=""
                      src={deletar}
                      onClick={(e) => {
                        updateAlergiaGhap(item);
                        e.stopPropagation()
                      }}
                      style={{
                        margin: 10,
                        height: 30,
                        width: 30,
                      }}
                    ></img>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pulsewidgetcontent">
          <button
            className="blue-button" style={{ width: 50, height: 50, alignSelf: 'center' }}
            onClick={(e) => { setalergiafield(1); e.stopPropagation() }}
          >
            +
          </button>
        </div>
      </div>
    )
  }
  // componente para descrição de alergia.
  const [alergiafield, setalergiafield] = useState(0);
  function AlergiaField() {
    return (
      <div
        className="menucover"
        onClick={() => setalergiafield(0)}
        style={{
          display: alergiafield == 1 ? 'flex' : 'none',
          zIndex: 9, flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center'
        }}>
        <div className="menucontainer">
          <div id="cabeçalho" className="cabecalho">
            <div>{'INSERIR ALERGIA'}</div>
            <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <button className="red-button" onClick={() => setalergiafield(0)}>
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
                onClick={() => insertAlergiaGhap()}
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
          <div className="corpo" onClick={(e) => e.stopPropagation()}>
            <input
              className="input"
              autoComplete="off"
              placeholder="ALERGIA."
              title="DESCREVA AQUI A ALERGIA DO PACIENTE."
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = 'ALERGIA.')}
              style={{
                height: 50,
                width: '30vw',
                margin: 0,
                padding: 0,
              }}
              id="inputAlergia"
              maxLength={200}
            ></input>
          </div>
        </div>
      </div>
    )
  }

  // card alergias.
  function CardDiagnosticos() {
    return (
      <div
        id="carddiagnostico"
        className="pulsewidgetscroll"
        title="DIAGNÓSTICOS."
        onClick={() => document.getElementById("carddiagnostico").classList.toggle("pulsewidgetscrollmax")}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          backgroundColor: listdiagnosticos.length > 0 ? '#ec7063' : '#52be80',
          borderColor: listdiagnosticos.length > 0 ? '#ec7063' : '#52be80'
        }}
      >
        <div className="pulsewidgettitle"
          style={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center', fontSize: 16 }}>
          {'DIAGNÓSTICOS'}
        </div>

        <div style={{ display: ghapalergias.length > 0 ? 'none' : 'flex' }}>
          <div className="pulsewidgetcontent">
            <div
              style={{
                display: 'flex',
                color: '#ffffff',
                fontWeight: 'bold', textAlign: 'center', fontSize: 14,
                marginBottom: 10
              }}>
              {'SEM REGISTROS DE DIAGNÓSTICOS'}
            </div>
          </div>
        </div>

        <div id="nivel1" style={{ display: ghapalergias.length < 1 ? 'none' : 'flex', width: '100%' }}>
          <div id="nivel2" className="pulsewidgetcontent" >
            <div style={{
              display: 'flex',
              flexDirection: 'column', justifyContent: 'center',
              marginBottom: 10,
              paddingRight: 15,
              width: '100%'
            }}>

              {listdiagnosticos.map(item => (
                <div className="row"
                  style={{
                    display: 'flex', flexDirection: 'row',
                    backgroundColor: '#F1948A',
                    padding: 10,
                    width: '100%',
                    opacity: item.datatermino == null ? 1 : 0.5
                  }}
                  onMouseEnter={() => document.getElementById("btndeletediagnostico").style.opacity = 1}
                  onMouseLeave={() => document.getElementById("btndeletediagnostico").style.opacity = 0}
                >
                  <div
                    title={
                      item.datatermino == null ?
                        "REGISTRADO POR: " + item.idprofissional + ", EM " + moment(item.datainicio).format('DD/MM/YY') :
                        "REGISTRADO POR: " + item.idprofissional + ", EM " + moment(item.datainicio).format('DD/MM/YY') +
                        ". ENCERRADO POR " + item.idprofissional + ", EM " + moment(item.datatermino).format('DD/MM/YY') + '.'
                    }
                    className="title2center"
                    style={{
                      color: '#ffffff', opacity: item.datatermino == null ? 1 : 0.5,
                      width: '100%'
                    }}>
                    {item.cid + ' - ' + item.descricao.toString().toUpperCase()}
                  </div>
                  <button id="btndeletediagnostico" className="animated-red-button"
                    style={{ display: item.datatermino == null ? 'flex' : 'none' }}
                  >
                    <img
                      alt=""
                      src={deletar}
                      onClick={(e) => {
                        updateDiagnosticoGhap(item);
                        e.stopPropagation()
                      }}
                      style={{
                        margin: 10,
                        height: 30,
                        width: 30,
                      }}
                    ></img>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pulsewidgetcontent">
          <button
            className="blue-button" style={{ width: 50, height: 50, alignSelf: 'center' }}
            onClick={(e) => { setcidselector(1); getListaDeDiagnosticos(); e.stopPropagation() }}
          >
            +
          </button>
        </div>
      </div>
    )
  }

  // componente para seleção do CID e diagnóstico.
  // var cid10 = 'https://cid10-api.herokuapp.com/cid10'; // SE FOR USAR API DE TERCEIROS.
  const [listacid, setlistacid] = useState([]);
  const [arraycid, setarraycid] = useState([]);
  const getListaDeDiagnosticos = () => {
    axios.get(htmlghapcid).then((response) => {
      var x = [0, 1];
      x = response.data;
      setlistacid(x.rows);
      setarraycid(x.rows);
      // alert(listacid.length)
    });
  }
  const [cidselector, setcidselector] = useState(0);
  function ViewCidOptions() {
    return (
      <div
        className="menucover"
        onClick={() => setcidselector(0)}
        style={{
          display: cidselector == 1 ? 'flex' : 'none',
          zIndex: 9, flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center'
        }}>
        <div className="menucontainer">
          <div id="cabeçalho" className="cabecalho">
            <div>{'INSERIR DIAGNÓSTICO'}</div>
            <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <button className="red-button" onClick={() => setcidselector(0)}>
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
          <div className="corpo" onClick={(e) => e.stopPropagation()}>
            <input
              className="input"
              autoComplete="off"
              placeholder="BUSCAR..."
              title="BUSCAR DIAGNÓSTICO."
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = 'BUSCAR...')}
              style={{
                height: 50,
                width: '40vw',
                margin: 0,
                padding: 0,
              }}
              id="inputDiagnostico"
              maxLength={200}
            ></input>
            <div>
            </div>
            <div className="scroll">
              {arraycid.map(item => (
                <div
                  className="blue-button"
                  onClick={() => {
                    insertDiagnosticoGhap(item.cid, item.descricao);
                  }}
                  style={{ marginTop: 10, padding: 10, margin: 5, width: '100%', minWidth: '100%', height: '30vh' }}
                >
                  {item.cid + ' - ' + item.descricao.toString().toUpperCase()}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // card dias de internação.
  function CardDiasdeInternacao() {
    return (
      <div
        className="pulsewidgetstatic"
        style={{ backgroundColor: '#8f9bbc', display: 'flex', }}
        id="DIAS DE INTERNAÇÃO"
      >
        <p
          className="title5"
          style={{
            marginBottom: 0,
            textAlign: 'center',
          }}
        >
          {'TEMPO DE INTERNAÇÃO: ' + moment().diff(moment(datainternacao), 'days') + ' DIAS.'}
        </p>
      </div>
    )
  }

  // CARD DADOS VITAIS (GRÁFICO).
  // função para captura dos dados vitais do atendimento atual.
  const [dadosvitais, setdadosvitais] = useState([]);

  const [dadosvitaistaxlabel, setdadosvitaistaxlabel] = useState([]);
  const [dadosvitaistaxvalue, setdadosvitaistaxvalue] = useState([]);

  const [dadosvitaisfclabel, setdadosvitaisfclabel] = useState([]);
  const [dadosvitaisfcvalue, setdadosvitaisfcvalue] = useState([]);

  const [dadosvitaisfrlabel, setdadosvitaisfrlabel] = useState([]);
  const [dadosvitaisfrvalue, setdadosvitaisfrvalue] = useState([]);

  const [dadosvitaispamlabel, setdadosvitaispamlabel] = useState([]);
  const [dadosvitaispamvalue, setdadosvitaispamvalue] = useState([]);

  const [dadosvitaissao2label, setdadosvitaissao2label] = useState([]);
  const [dadosvitaissao2value, setdadosvitaissao2value] = useState([]);

  const [dadosvitaisfc, setdadosvitaisfc] = useState([]);
  const [dadosvitaisfr, setdadosvitaisfr] = useState([]);
  const [dadosvitaispam, setdadosvitaispam] = useState([]);
  const getDadosVitais = (valor) => {
    setloadprincipal(1);
    axios.get(htmldadosvitais + valor).then((response) => {
      var x = [0, 1];
      var y = [0, 1];
      x = response.data;
      y = x.filter(item => moment(item.data_coleta) > moment().subtract(15, 'days')).sort((a, b) => moment(a.data_coleta) - moment(b.data_coleta));
      setdadosvitais(y);
      // alert(valor);

      // tax.
      let correcttaxlabel = y.filter(item => item.cd_sinal_vital == 1).map(item => moment(item.data_coleta).format('DD/MM - HH') + 'H');
      let correcttaxvalue = y.filter(item => item.cd_sinal_vital == 1).map(item => item.valor);
      setdadosvitaistaxlabel(correcttaxlabel.slice(-12));
      setdadosvitaistaxvalue(correcttaxvalue.slice(-12));

      // fc.
      let correctfclabel = y.filter(item => item.cd_sinal_vital == 2).map(item => moment(item.data_coleta).format('DD/MM - HH') + 'H');
      let correctfcvalue = y.filter(item => item.cd_sinal_vital == 2).map(item => item.valor);
      setdadosvitaisfclabel(correctfclabel.slice(-12));
      setdadosvitaisfcvalue(correctfcvalue.slice(-12));

      // fr.
      let correctfrlabel = y.filter(item => item.cd_sinal_vital == 3).map(item => moment(item.data_coleta).format('DD/MM - HH') + 'H');
      let correctfrvalue = y.filter(item => item.cd_sinal_vital == 3).map(item => item.valor);
      setdadosvitaisfrlabel(correctfrlabel.slice(-12));
      setdadosvitaisfrvalue(correctfrvalue.slice(-12));

      // pam.
      let correctpaslabel = y.filter(item => item.cd_sinal_vital == 4).map(item => moment(item.data_coleta).format('DD/MM - HH') + 'H').slice(-12);
      let correctpasvalue = y.filter(item => item.cd_sinal_vital == 4).map(item => item.valor).slice(-12);
      let correctpadvalue = y.filter(item => item.cd_sinal_vital == 5).map(item => item.valor).slice(-12);
      var posicao = -1;
      let correctpam = [];
      for (var i = 0; i < 12; i++) {
        posicao = posicao + 1
        var pas = correctpasvalue.slice(posicao, posicao + 1);
        var pad = correctpadvalue.slice(posicao, posicao + 1);
        var pam = Math.ceil((parseInt(pas) + (2 * parseInt(pad))) / 3);
        correctpam.push(pam);
      }
      setTimeout(() => {
        setdadosvitaispamlabel(correctpaslabel);
        setdadosvitaispamvalue(correctpam);
      }, 1000);

      // sao2.
      let correctsao2label = y.filter(item => item.cd_sinal_vital == 11).map(item => moment(item.data_coleta).format('DD/MM - HH') + 'H');
      let correctsao2value = y.filter(item => item.cd_sinal_vital == 11).map(item => item.valor);
      setdadosvitaissao2label(correctsao2label.slice(-12));
      setdadosvitaissao2value(correctsao2value.slice(-12));

      setdadosvitaisfc(y.filter(item => item.cd_sinal_vital == 2).slice(-21));
      setdadosvitaisfr(y.filter(item => item.cd_sinal_vital == 3).slice(-21));
      setdadosvitaispam(y.filter(item => item.cd_sinal_vital == 6).slice(-21));

      arrayCodigosDadosVitais.map(item => getLastDadosClinicos(y, item));
      arrayCodigosDadosVitais.map(item => getDataToDataChart(y, item));
      setTimeout(() => {
        setarrayLastDadosClinicos(fdp1);
        setarrayDadosDataChart(fdp2);
        // alert(JSON.stringify(arrayDadosDataChart));
      }, 1000);

      setTimeout(() => {
        setloadprincipal(0);
        document.getElementById("cardcontroles").className = "pulsewidgetcontrolescardhover";
        document.getElementById("cardcontroles").setAttribute("disabled", "true");
        document.getElementById("seletores dos gráficos").className = "pulsewidgetcontroleshover";
        document.getElementById("gráfico de controles").className = "pulsewidgetcontroleshover";
        document.getElementById("botaominimizacardcontroles").style.display = 'flex';
        var position = document.getElementById("cardcontroles").offsetTop;
        document.getElementById("painel principal").scrollTo(0, position - 230);
      }, 5000);
    })
  }

  // CARD BALANÇO HÍDRICO
  const [balancohidrico, setbalancohidrico] = useState([0, 1]);
  const [balancoacumulado, setbalancoacumulado] = useState(0);
  const getBalancoHidrico = (valor) => {
    axios
      .get(htmlbalancohidrico + valor)
      .then((response) => {
        var x = [0, 1];
        var y = [0, 1];
        var z = [0, 1];
        x = response.data;
        z = x.slice(-1);
        setbalancohidrico(z); // último registro de balanço hídrico.
        y = x.map(item => item.vl_coleta).reduce(somabalancohidrico, 0);
        setbalancoacumulado(y);
        // alert(balancohidrico);
      })
      .catch(() => setbalancohidrico([]));
  }

  function somabalancohidrico(acumulado, novo) {
    return acumulado + novo;
  }

  function CardBalancoHidrico() {
    return (
      <div
        className="pulsewidgetstatic"
        style={{
          display: 'flex',
          height: 150, width: 150,
          minHeight: 150, minWidth: 150,
          margin: 10, padding: 10,
        }}
        id="BALANÇO HÍDRICO"
      >
        <div
          className="title2center"
          style={{
            marginBottom: 0,
            textAlign: 'center',
          }}
        >
          {'BALANÇO HÍDRICO:'}
        </div>
        <div style={{ display: balancohidrico.length > 0 ? 'flex' : 'none' }}>
          <div
            className="title2center"
            style={{
              marginBottom: 0,
              textAlign: 'center',
            }}
          >
            {balancohidrico.map(item => moment(item.dh_registro).format('DD/MM/YY'))}
          </div>
          <div
            className="title2center"
            style={{
              marginBottom: 0,
              textAlign: 'center',
            }}
          >
            {balancohidrico.map(item => item.vl_coleta) + 'ML'}
          </div>
        </div>
        <div style={{ display: balancohidrico.length < 1 ? 'flex' : 'none' }}>
          <div
            style={{
              marginBottom: 0,
              textAlign: 'center',
            }}
          >
            {'SEM REGISTROS DE BALANÇO HÍDRICO'}
          </div>
        </div>
      </div>
    )
  }

  /* 
  criação de uma array com descrição, valores e datas dos últimos 
  dados clínicos do  atendimento (arrayLastDadosClinicos), a partir de uma array 
  contendo os códigos de cada dado clínico (arrayCodigoDadosVitais).
  */
  const arrayCodigosDadosVitais = [1, 2, 3, 4, 5, 11];
  const [arrayLastDadosClinicos, setarrayLastDadosClinicos] = useState([]);
  const [arrayDadosDataChart, setarrayDadosDataChart] = useState([]);

  const [dataDadosVitais, setdataDadosVitais] = useState([]);
  const [valorDadosVitais, setvalorDadosVitais] = useState([]);

  // função para captura dos últimos registros de cada dado vital.
  var fdp1 = [];
  const getLastDadosClinicos = (dados, codigo) => {
    var lastregistro = dados.filter(item => item.cd_sinal_vital == codigo).slice(-1);
    var codigo = codigo;
    var descricao = lastregistro.map(item => item.ds_sinal_vital);
    var valor = lastregistro.map(item => item.valor);
    var data = lastregistro.map(item => moment(item.data_coleta).format('DD/MM/YYYY - HH:MM'));
    fdp1.push(
      {
        codigo: codigo,
        descricao: descricao,
        valor: valor,
        data: data
      }
    )
  }

  // função para captura dos valores para os gráficos de dados vitais.
  var fdp2 = [];
  const getDataToDataChart = (data, codigo) => {
    var valor = [0, 1];
    valor = data.filter(item => item.cd_sinal_vital == codigo && item.valor > 0).map(item => ' ' + item.valor).slice(-7);
    setdataDadosVitais(data.filter(item => item.cd_sinal_vital == codigo && item.valor > 0).map(item => moment(item.data_coleta).format('DD/MM/YYYY - HH:MM')));
    setvalorDadosVitais(data.filter(item => item.cd_sinal_vital == codigo && item.valor > 0).map(item => ' ' + item.valor));

    // randomizando cores dos gráficos.
    var dynamicColors = function () {
      var r = Math.floor(Math.random() * 255);
      var g = Math.floor(Math.random() * 255);
      var b = Math.floor(Math.random() * 255);
      return "rgb(" + r + "," + g + "," + b + ")";
    };

    fdp2.push(
      {
        label: data.filter(item => item.cd_sinal_vital == codigo).slice(-1).map(item => item.ds_sinal_vital),
        data: valor,
        borderColor: dynamicColors(),
        pointBackgroundColor: dynamicColors(),
        fill: false
      }
    );
  }

  const filterDataToDataChart = (codigo) => {
    // alert(codigo);
    setdataDadosVitais([]);
    setvalorDadosVitais([]);
    setdataDadosVitais(dadosvitais.filter(item => item.cd_sinal_vital == codigo && item.valor > 0).map(item => moment(item.data_coleta).format('DD/MM/YYYY - HH:MM')));
    setvalorDadosVitais(dadosvitais.filter(item => item.cd_sinal_vital == codigo && item.valor > 0).map(item => ' ' + item.valor));

    // randomizando cores dos gráficos.
    var dynamicColors = function () {
      var r = Math.floor(Math.random() * 255);
      var g = Math.floor(Math.random() * 255);
      var b = Math.floor(Math.random() * 255);
      return "rgb(" + r + "," + g + "," + b + ")";
    };

    fdp2.push(
      {
        label: dadosvitais.filter(item => item.cd_sinal_vital == codigo).slice(-1).map(item => item.ds_sinal_vital),
        data: valorDadosVitais,
        borderColor: "8f9bbc",
        pointBackgroundColor: "8f9bbc",
        fill: false
      }
    );

    setarrayDadosDataChart(fdp2);
    var position = document.getElementById("cardcontroles").offsetTop;
    setTimeout(() => {
      // alert(position);
      document.getElementById("painel principal").scrollTo(0, position - 230);
    }, 1000);
  }

  // gráfico dos dados vitais.
  const dataChartDadosVitais = () => {
    return {
      labels: dataDadosVitais,
      datasets: arrayDadosDataChart
    }
  }

  function ChartDadosVitais() {
    return (
      <Line
        data={dataChartDadosVitais}
        padding={10}
        width={window.innerWidth > 400 ? 0.1 * window.innerWidth * valorDadosVitais.length : 200}
        plugins={ChartDataLabels}
        options={{
          scales: {
            xAxes: [
              {
                display: true,
                ticks: {
                  padding: 10,
                  fontColor: '#61636e',
                  fontWeight: 'bold',
                },
                gridLines: {
                  zeroLineColor: 'transparent',
                  lineWidth: 0,
                  drawOnChartArea: true,
                },
              },
            ],
            yAxes: [
              {
                display: false,
                ticks: {
                  padding: 10,
                  suggestedMin: 0,
                  suggestedMax: 200,
                  fontColor: '#61636e',
                  fontWeight: 'bold',
                },
                gridLines: {
                  zeroLineColor: 'transparent',
                  lineWidth: 0,
                  drawOnChartArea: true,
                },
              },
            ],
          },
          plugins: {
            datalabels: {
              display: false,
              color: '#ffffff',
              font: {
                weight: 'bold',
                size: 16,
              },
            },
          },
          tooltips: {
            enabled: true,
            displayColors: false,
          },
          hover: { mode: null },
          elements: {},
          animation: {
            duration: 500,
          },
          title: {
            display: false,
            text: 'PPS',
          },
          legend: {
            display: true,
            position: 'bottom',
            align: 'start'
          },
          maintainAspectRatio: true,
          responsive: false,
        }}
      />
    );
  }

  // randomizando cores dos gráficos.
  var dynamicColors = function () {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return "rgb(" + r + "," + g + "," + b + ")";
  };

  // gráfico para TODOS OS DADOS CLÍNICOS.
  const dataChartControles = {
    labels: dadosvitaistaxlabel,
    datasets: [
      {
        data: dadosvitaistaxvalue,
        label: 'TAX',
        borderColor: '#BB8FCE',
        pointBackgroundColor: '#BB8FCE',
        fill: 'false'
      },
      {
        data: dadosvitaisfcvalue,
        label: 'FC',
        borderColor: '#52BE80',
        pointBackgroundColor: '#52BE80',
        fill: 'false'
      },
      {
        data: dadosvitaisfrvalue,
        label: 'FR',
        borderColor: '#7FB3D5',
        pointBackgroundColor: '#7FB3D5',
        fill: 'false'
      },
      {
        data: dadosvitaispamvalue,
        label: 'PAM',
        borderColor: '#EC7063',
        pointBackgroundColor: '#EC7063',
        fill: 'false'
      },
      {
        data: dadosvitaissao2value,
        label: 'SAO2',
        borderColor: '#85C1E9',
        pointBackgroundColor: '#85C1E9',
        fill: 'false'
      },
    ],
  }
  function ChartControles() {
    return (
      <div className="dadosclinicosgraficomostra" id="chartcontroles">
        <Line
          ref={myChartRef}
          data={dataChartControles}
          plugins={ChartDataLabels}
          width="400"
          height="100"
          options={{
            layout: {
              padding: {
                left: 0,
                right: 4,
                top: 0,
                bottom: 0
              }
            },
            scales: {
              xAxes: [
                {
                  display: true,
                  ticks: {
                    fontSize: 10,
                    width: 50,
                    padding: 10,
                    display: true,
                    fontColor: '#61636e',
                    fontWeight: 'bold',
                  },
                  gridLines: {
                    tickMarkLength: false,
                    zeroLineColor: 'transparent',
                    lineWidth: 1,
                    drawOnChartArea: true,
                  },
                },
              ],
              yAxes: [
                {
                  display: true,
                  ticks: {
                    padding: 10,
                    fontSize: 10,
                    display: true,
                    suggestedMin: 0,
                    suggestedMax: 250,
                    fontColor: '#61636e',
                    fontWeight: 'bold',
                  },
                  gridLines: {
                    tickMarkLength: false,
                    zeroLineColor: 'transparent',
                    lineWidth: 1,
                    drawOnChartArea: true,
                  },
                },
              ],
            },
            plugins: {
              datalabels: {
                display: false,
                color: '#ffffff',
                font: {
                  weight: 'bold',
                  size: 16,
                },
              },
            },
            tooltips: {
              enabled: true,
              displayColors: false,
            },
            hover: { mode: null },
            elements: {},
            animation: {
              duration: 500,
            },
            title: {
              display: false,
              text: 'PPS',
            },
            legend: {
              display: false,
              position: 'bottom',
              align: 'start'
            },
            maintainAspectRatio: true,
            responsive: true,
          }}
        />
      </div>
    );
  }

  // gráfico para TAX (código 1).
  const dataChartControlesTax = {
    labels: dadosvitaistaxlabel,
    datasets: [
      {
        data: dadosvitaistaxvalue,
        label: 'TAX',
        borderColor: '#BB8FCE',
        pointBackgroundColor: '#BB8FCE',
        fill: 'false'
      },
    ],
  }
  function ChartControlesTax() {
    return (
      <div className="dadosclinicosgraficoesconde" id={"chartcontroles" + 1}>
        <Line
          ref={myChartRef}
          data={dataChartControlesTax}
          plugins={ChartDataLabels}
          width="400"
          height="100"
          options={{
            layout: {
              padding: {
                left: 0,
                right: 4,
                top: 0,
                bottom: 0
              }
            },
            scales: {
              xAxes: [
                {
                  display: true,
                  ticks: {
                    padding: 10,
                    fontSize: 10,
                    display: true,
                    fontColor: '#61636e',
                    fontWeight: 'bold',
                  },
                  gridLines: {
                    tickMarkLength: false,
                    zeroLineColor: 'transparent',
                    lineWidth: 1,
                    drawOnChartArea: true,
                  },
                },
              ],
              yAxes: [
                {
                  display: true,
                  ticks: {
                    padding: 10,
                    fontSize: 10,
                    display: true,
                    suggestedMin: 30,
                    suggestedMax: 50,
                    fontColor: '#61636e',
                    fontWeight: 'bold',
                  },
                  gridLines: {
                    tickMarkLength: false,
                    zeroLineColor: 'transparent',
                    lineWidth: 1,
                    drawOnChartArea: true,
                  },
                },
              ],
            },
            plugins: {
              datalabels: {
                display: false,
                color: '#ffffff',
                font: {
                  weight: 'bold',
                  size: 16,
                },
              },
            },
            tooltips: {
              enabled: true,
              displayColors: false,
            },
            hover: { mode: null },
            elements: {},
            animation: {
              duration: 500,
            },
            title: {
              display: false,
              text: 'PPS',
            },
            legend: {
              display: false,
              position: 'bottom',
              align: 'start'
            },
            maintainAspectRatio: true,
            responsive: true,
          }}
        />
      </div>
    );
  }

  // gráfico para FC (código 2).
  const dataChartControlesFc = {
    labels: dadosvitaisfclabel,
    datasets: [
      {
        data: dadosvitaisfcvalue,
        label: 'FC',
        borderColor: '#52BE80',
        pointBackgroundColor: '#52BE80',
        fill: 'false'
      },
    ],
  }
  function ChartControlesFc() {
    return (
      <div className="dadosclinicosgraficoesconde" id={"chartcontroles" + 2}>
        <Line
          ref={myChartRef}
          data={dataChartControlesFc}
          plugins={ChartDataLabels}
          width="400"
          height="100"
          options={{
            layout: {
              padding: {
                left: 0,
                right: 4,
                top: 0,
                bottom: 0
              }
            },
            scales: {
              xAxes: [
                {
                  display: true,
                  ticks: {
                    padding: 10,
                    fontSize: 10,
                    display: true,
                    fontColor: '#61636e',
                    fontWeight: 'bold',
                  },
                  gridLines: {
                    tickMarkLength: false,
                    zeroLineColor: 'transparent',
                    lineWidth: 1,
                    drawOnChartArea: true,
                  },
                },
              ],
              yAxes: [
                {
                  display: true,
                  ticks: {
                    padding: 10,
                    fontSize: 10,
                    display: true,
                    suggestedMin: 50,
                    suggestedMax: 150,
                    fontColor: '#61636e',
                    fontWeight: 'bold',
                  },
                  gridLines: {
                    tickMarkLength: false,
                    zeroLineColor: 'transparent',
                    lineWidth: 1,
                    drawOnChartArea: true,
                  },
                },
              ],
            },
            plugins: {
              datalabels: {
                display: false,
                color: '#ffffff',
                font: {
                  weight: 'bold',
                  size: 16,
                },
              },
            },
            tooltips: {
              enabled: true,
              displayColors: false,
            },
            hover: { mode: null },
            elements: {},
            animation: {
              duration: 500,
            },
            title: {
              display: false,
              text: 'PPS',
            },
            legend: {
              display: false,
              position: 'bottom',
              align: 'start'
            },
            maintainAspectRatio: true,
            responsive: true,
          }}
        />
      </div>
    );
  }

  // gráfico para FR (código 3).
  const dataChartControlesFr = {
    labels: dadosvitaisfrlabel,
    datasets: [
      {
        data: dadosvitaisfrvalue,
        label: 'FR',
        borderColor: '#7FB3D5',
        pointBackgroundColor: '#7FB3D5',
        fill: 'false'
      },
    ],
  }
  function ChartControlesFr() {
    return (
      <div className="dadosclinicosgraficoesconde" id={"chartcontroles" + 3}>
        <Line
          ref={myChartRef}
          data={dataChartControlesFr}
          plugins={ChartDataLabels}
          width="400"
          height="100"
          options={{
            layout: {
              padding: {
                left: 0,
                right: 4,
                top: 0,
                bottom: 0
              }
            },
            scales: {
              xAxes: [
                {
                  display: true,
                  ticks: {
                    padding: 10,
                    fontSize: 10,
                    display: true,
                    fontColor: '#61636e',
                    fontWeight: 'bold',
                  },
                  gridLines: {
                    tickMarkLength: false,
                    zeroLineColor: 'transparent',
                    lineWidth: 1,
                    drawOnChartArea: true,
                  },
                },
              ],
              yAxes: [
                {
                  display: true,
                  ticks: {
                    padding: 10,
                    fontSize: 10,
                    display: true,
                    suggestedMin: 10,
                    suggestedMax: 40,
                    fontColor: '#61636e',
                    fontWeight: 'bold',
                  },
                  gridLines: {
                    tickMarkLength: false,
                    zeroLineColor: 'transparent',
                    lineWidth: 1,
                    drawOnChartArea: true,
                  },
                },
              ],
            },
            plugins: {
              datalabels: {
                display: false,
                color: '#ffffff',
                font: {
                  weight: 'bold',
                  size: 16,
                },
              },
            },
            tooltips: {
              enabled: true,
              displayColors: false,
            },
            hover: { mode: null },
            elements: {},
            animation: {
              duration: 500,
            },
            title: {
              display: false,
              text: 'PPS',
            },
            legend: {
              display: false,
              position: 'bottom',
              align: 'start'
            },
            maintainAspectRatio: true,
            responsive: true,
          }}
        />
      </div>
    );
  }

  // gráfico para PAM (código 6).
  const dataChartControlesPam = {
    labels: dadosvitaistaxlabel,
    datasets: [
      {
        data: dadosvitaispamvalue,
        label: 'PAM',
        borderColor: '#EC7063',
        pointBackgroundColor: '#EC7063',
        fill: 'false'
      },
    ],
  }
  function ChartControlesPam() {
    return (
      <div className="dadosclinicosgraficoesconde" id={"chartcontroles" + 4}>
        <Line
          ref={myChartRef}
          data={dataChartControlesPam}
          plugins={ChartDataLabels}
          width="400"
          height="100"
          options={{
            layout: {
              padding: {
                left: 0,
                right: 4,
                top: 0,
                bottom: 0
              }
            },
            scales: {
              xAxes: [
                {
                  display: true,
                  ticks: {
                    padding: 10,
                    fontSize: 10,
                    display: true,
                    fontColor: '#61636e',
                    fontWeight: 'bold',
                  },
                  gridLines: {
                    tickMarkLength: false,
                    zeroLineColor: 'transparent',
                    lineWidth: 1,
                    drawOnChartArea: true,
                  },
                },
              ],
              yAxes: [
                {
                  display: true,
                  ticks: {
                    padding: 10,
                    fontSize: 10,
                    display: true,
                    suggestedMin: 50,
                    suggestedMax: 150,
                    fontColor: '#61636e',
                    fontWeight: 'bold',
                  },
                  gridLines: {
                    tickMarkLength: false,
                    zeroLineColor: 'transparent',
                    lineWidth: 1,
                    drawOnChartArea: true,
                  },
                },
              ],
            },
            plugins: {
              datalabels: {
                display: false,
                color: '#ffffff',
                font: {
                  weight: 'bold',
                  size: 16,
                },
              },
            },
            tooltips: {
              enabled: true,
              displayColors: false,
            },
            hover: { mode: null },
            elements: {},
            animation: {
              duration: 500,
            },
            title: {
              display: false,
              text: 'PPS',
            },
            legend: {
              display: false,
              position: 'bottom',
              align: 'start'
            },
            maintainAspectRatio: true,
            responsive: true,
          }}
        />
      </div>
    );
  }

  // gráfico para SAO2 (código 11).
  const dataChartControlesSao2 = {
    labels: dadosvitaissao2label,
    datasets: [
      {
        data: dadosvitaissao2value,
        label: 'FR',
        borderColor: '#85C1E9',
        pointBackgroundColor: '#85C1E9',
        fill: 'false'
      },
    ],
  }
  function ChartControlesSao2() {
    return (
      <div className="dadosclinicosgraficoesconde" id={"chartcontroles" + 11}>
        <Line
          ref={myChartRef}
          data={dataChartControlesSao2}
          plugins={ChartDataLabels}
          width="400"
          height="100"
          options={{
            layout: {
              padding: {
                left: 0,
                right: 4,
                top: 0,
                bottom: 0
              }
            },
            scales: {
              xAxes: [
                {
                  display: true,
                  ticks: {
                    padding: 10,
                    fontSize: 10,
                    display: true,
                    fontColor: '#61636e',
                    fontWeight: 'bold',
                  },
                  gridLines: {
                    tickMarkLength: false,
                    zeroLineColor: 'transparent',
                    lineWidth: 1,
                    drawOnChartArea: true,
                  },
                },
              ],
              yAxes: [
                {
                  display: true,
                  ticks: {
                    padding: 10,
                    fontSize: 10,
                    display: true,
                    suggestedMin: 60,
                    suggestedMax: 100,
                    fontColor: '#61636e',
                    fontWeight: 'bold',
                  },
                  gridLines: {
                    tickMarkLength: false,
                    zeroLineColor: 'transparent',
                    lineWidth: 1,
                    drawOnChartArea: true,
                  },
                },
              ],
            },
            plugins: {
              datalabels: {
                display: false,
                color: '#ffffff',
                font: {
                  weight: 'bold',
                  size: 16,
                },
              },
            },
            tooltips: {
              enabled: true,
              displayColors: false,
            },
            hover: { mode: null },
            elements: {},
            animation: {
              duration: 500,
            },
            title: {
              display: false,
              text: 'PPS',
            },
            legend: {
              display: false,
              position: 'bottom',
              align: 'start'
            },
            maintainAspectRatio: true,
            responsive: true,
          }}
        />
      </div>
    );
  }
  const myChartRef = React.createRef();
  const toggleDataset = () => {
    let chart = myChartRef.current.chartInstance;
    chart.hide(1);
  };

  var corlinha = '';
  var corfundo = '';
  var dynamicColors = function () {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    corlinha = "rgb(" + r + "," + g + "," + b + ")";
    corfundo = "rgba(" + r + "," + g + "," + b + ", 0.3)";
  };
  const renderCharts = (codigo) => {
    // alert(dadosvitais.filter(item => item.cd_sinal_vital == codigo).map(item => item.valor))
    dynamicColors();
    return (
      <div className="dadosclinicosgraficoesconde" id={"dadosclinicosgrafico" + codigo}>
        <Line
          data={{
            labels: dadosvitais.filter(item => item.cd_sinal_vital == codigo).sort(((a, b) => moment(a.data_coleta).format('DD/MM/YYYY - HH:MM') < moment(b.data_coleta).format('DD/MM/YYYY - HH:MM'))).map(item => moment(item.data_coleta).format('DD/MM/YYYY - HH:MM')),
            datasets: [
              {
                data: dadosvitais.filter(item => item.cd_sinal_vital == codigo).sort(((a, b) => a.cd_sinal_vital < b.cd_sinal_vital)).map(item => item.valor).slice(-21),
                label: dadosvitais.filter(item => item.cd_sinal_vital == codigo).map(item => item.ds_sinal_vital).slice(-1),
                backgroundColor: corfundo,
                borderColor: corlinha,
                hoverBorderColor: corlinha,
                pointBackgroundColor: corlinha,
              },
            ],
          }}
          width={window.innerWidth > 400 ? 100 * valorDadosVitais.length : 200}
          plugins={ChartDataLabels}
          options={{
            scales: {
              xAxes: [
                {
                  display: true,
                  ticks: {
                    padding: 10,
                    fontSize: 10,
                    display: true,
                    fontColor: '#61636e',
                    fontWeight: 'bold',
                  },
                  gridLines: {
                    tickMarkLength: false,
                    zeroLineColor: 'transparent',
                    lineWidth: 0,
                    drawOnChartArea: true,
                  },
                },
              ],
              yAxes: [
                {
                  display: true,
                  ticks: {
                    padding: 10,
                    fontSize: 10,
                    suggestedMin: 0,
                    suggestedMax: 200,
                    fontColor: '#61636e',
                    fontWeight: 'bold',
                  },
                  gridLines: {
                    tickMarkLength: false,
                    zeroLineColor: 'transparent',
                    lineWidth: 0,
                    drawOnChartArea: true,
                  },
                },
              ],
            },
            plugins: {
              datalabels: {
                display: false,
                color: '#ffffff',
                font: {
                  weight: 'bold',
                  size: 16,
                },
              },
            },
            tooltips: {
              enabled: true,
              displayColors: false,
            },
            hover: { mode: null },
            elements: {},
            animation: {
              duration: 500,
            },
            title: {
              display: false,
              text: 'PPS',
            },
            legend: {
              display: false,
              position: 'bottom',
              align: 'start'
            },
            maintainAspectRatio: true,
            responsive: false,
          }}
        />
      </div>
    );
  }

  // card dados vitais / controles.
  const CardControles = useCallback(() => {
    return (
      <div id="cardcontroles"
        className="pulsewidgetcontrolescard" style={{ position: 'relative' }}
        onClick={(e) => {
          // freezeScreen(5000);
          // carregando dados vitais.
          getDadosVitais(idatendimento);
          e.stopPropagation();
        }}
      >
        <button id="botaominimizacardcontroles" className="blue-button"
          style={{ display: 'none', width: 20, minWidth: 20, height: 20, minHeight: 20, position: 'absolute', top: 10, right: 10 }}
          onClick={(e) => {
            document.getElementById("cardcontroles").className = "pulsewidgetcontrolescard";
            document.getElementById("cardcontroles").removeAttribute("disabled");
            document.getElementById("seletores dos gráficos").className = "pulsewidgetcontroles";
            document.getElementById("gráfico de controles").className = "pulsewidgetcontroles";
            document.getElementById("botaominimizacardcontroles").style.display = 'none';
            e.stopPropagation();
          }}
        >
          -
        </button>
        <div id="titulodadosvitais">
          <div
            className="title4">
            {'CONTROLES'}
          </div>
        </div>
        <div id="conteudodadosvitais"
          style={{ display: 'flex', flexDirection: 'column' }}>
          <div id="seletores dos gráficos"
            className="pulsewidgetcontroles"
          >
            {arrayLastDadosClinicos.map(item => (
              <button id={"btngrafico" + item.codigo}
                className="blue-button"
                onClick={(e) => {
                  // document.getElementById("cardcontroles").className = 'pulsewidgetcontrolescardhoverexpanded'
                  // document.getElementById("gráfico de controles").style.display = 'flex';
                  var graficos = document.getElementById("mappedgraphics").getElementsByClassName("dadosclinicosgraficomostra");
                  for (var i = 0; i < graficos.length; i++) {
                    graficos.item(i).className = "dadosclinicosgraficoesconde";
                  }

                  if (item.codigo == 4 || item.codigo == 5) {
                    document.getElementById("chartcontroles" + 4).className = "dadosclinicosgraficomostra"
                  } else {
                    document.getElementById("chartcontroles" + item.codigo).className = "dadosclinicosgraficomostra"
                  }
                  // alert(item.codigo);
                  e.stopPropagation();
                }}
                style={{
                  display: 'flex', flexDirection: 'column', justifyContent: 'center',
                  backgroundColor:
                    item.codigo == 1 ? '#BB8FCE' :
                      item.codigo == 2 ? '#52BE80' :
                        item.codigo == 3 ? '#7FB3D5' :
                          item.codigo == 11 ? '#85C1E9' : '#EC7063',
                  height: 150, width: 150,
                  minHeight: 150, minWidth: 150,
                  margin: 10, padding: 10,
                }}>
                <div style={{ height: 75, display: 'flex', flexDirection: 'column', justifyContent: 'center', verticalAlign: 'center' }}>
                  <div>{item.descricao}</div>
                </div>
                <div style={{ fontSize: 18 }}>{item.valor}</div>
                <div>{JSON.stringify(item.data).substring(2, 12)}</div>
                <div>{JSON.stringify(item.data).substring(15, 20)}</div>
              </button>
            ))}
            <CardBalancoHidrico></CardBalancoHidrico>
          </div>
          <div id="gráfico de controles"
            className="pulsewidgetcontroles"
            style={{ overflowX: 'hidden' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div id="mappedgraphics"
              style={{
                display: 'flex',
                flexDirection: 'column', justifyContent: 'center',
                alignItems: 'center', alignContent: 'center', padding: 10,
              }}>
              <ChartControles></ChartControles>
              <ChartControlesTax></ChartControlesTax>
              <ChartControlesFc></ChartControlesFc>
              <ChartControlesFr></ChartControlesFr>
              <ChartControlesPam></ChartControlesPam>
              <ChartControlesSao2></ChartControlesSao2>
            </div>
          </div>
        </div>
      </div >
    );
  }, [arrayLastDadosClinicos, arrayDadosDataChart, valorDadosVitais]);

  // card para gerenciamento nutricional.
  // FEATURE: acrescentar GET, infusão e tipo de dieta.
  function CardNutricao() {
    return (
      <div id="cardnutricao" className="pulsewidgetscroll"
        onClick={() => {
          document.getElementById("cardnutricao").classList.toggle("pulsewidgetscrollmax");
        }}
        style={{
          // display: cardnutricao == 1 ? 'flex' : 'none';
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center',
          backgroundColor: '#8f9bbc', borderColor: '#8f9bbc', overflowY: 'hidden'
        }}
      >
        <div className="pulsewidgettitle"
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignSelf: 'center' }}>
          <div style={{ display: 'flex', color: "#ffffff", flexDirection: 'column', justifyContent: 'center' }}>
            {viadieta == 0 ? 'DIETA ORAL' :
              viadieta == 1 ? 'SONDA NASOENTÉRICA' :
                viadieta == 2 ? 'SONDA OROGÁSTRICA' :
                  viadieta == 3 ? 'GASTROSTOMIA' :
                    viadieta == 4 ? 'JEJUNOSTOMIA' :
                      'NUTRIÇÃO PARENTERAL TOTAL'
            }
          </div>
          <img
            alt=""
            src={cabeceira == 1 ? leito0 : cabeceira == 2 ? leito30 : cabeceira == 3 ? leito90 : fowler}
            style={{
              height: '80%',
              width: '80%',
              borderRadius: 5,
              alignSelf: 'center'
            }}
          ></img>
        </div>
        <div
          className="orange-button pulsewidgetcontent"
          id="DIETA"
          title="DIETA."
          style={{
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            position: 'relative', color: '#ffffff', fontSize: 16
          }}
          onClick={(e) => { setchangedieta(1); e.stopPropagation() }}
        >
          <div style={{ display: 'flex', color: "#ffffff", flexDirection: 'column', justifyContent: 'center' }}>
            {viadieta == 0 ? 'DIETA ORAL' : viadieta == 1 ? 'SONDA NASOENTÉRICA' : viadieta == 2 ? 'SONDA OROGÁSTRICA' : viadieta == 3 ? 'GASTROSTOMIA' : 'JEJUNOSTOMIA'}
          </div>

          <div style={{ display: viadieta != 0 ? 'flex' : 'none' }}>
            {'INFUSÃO: ' + infusaodieta + ' ml/h'}
          </div>
          <div style={{ display: viadieta != 0 ? 'flex' : 'none' }}>{'OBJETIVO: ' + getdieta + ' ml/h'}</div>

          <div
            className="blue-button"
            style={{
              display: 'flex', flexDirection: 'column', padding: 10,
              width: 65, minWidth: 65, height: 65, minHeight: 65,
              position: 'absolute', top: 5, right: 5
            }}
          >
            <img
              alt=""
              src={cabeceira == 1 ? leito0 : cabeceira == 2 ? leito30 : cabeceira == 3 ? leito90 : fowler}
              style={{
                height: '80%',
                width: '80%',
                borderRadius: 5,
              }}
            ></img>
          </div>
        </div>
      </div>
    )
  }

  const [changedieta, setchangedieta] = useState(0);
  const [viadieta, setviadieta] = useState(0);
  const [infusaodieta, setinfusaodieta] = useState(0);
  const [getdieta, setgetdieta] = useState(0); // get (objetivo) da dieta.
  const [cabeceira, setcabeceira] = useState(0);
  function ChangeDieta() {
    if (changedieta == 1) {
      return (
        <div
          className="menucover"
          onClick={(e) => { setchangedieta(0); e.stopPropagation() }}
          style={{
            zIndex: 9, display: 'flex', flexDirection: 'column',
            justifyContent: 'center', alignItems: 'center'
          }}>
          <div className="menucontainer">
            <div id="cabeçalho" className="cabecalho">
              <div>{'INFORMAÇÕES DE DIETA'}</div>
              <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <button className="red-button" onClick={() => setchangedieta(0)}>
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
                  onClick={insertDietaGhap()}
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
            <div className="corpo" onClick={(e) => e.stopPropagation()}>
              <label
                className="title2center"
                style={{ margin: 0 }}
              >
                VIA DE ADMINISTRAÇÃO DA DIETA:
              </label>
              <div id="VIA DE ADMINISTRAÇÃO DA DIETA."
                style={{
                  display: 'flex',
                  flexDirection: window.innerWidth > 800 ? 'row' : 'column',
                  justifyContent: 'space-between',
                  margin: 5,
                }}
              >
                <button
                  className={viadieta == 0 ? "red-button" : "blue-button"} style={{ width: 150, minWidth: 100, height: 75, minHeight: 50, padding: 10 }}
                  onClick={(e) => { setviadieta(0); e.stopPropagation() }}
                >
                  VIA ORAL
                </button>
                <button
                  className={viadieta == 1 ? "red-button" : "blue-button"} style={{ width: 150, minWidth: 100, height: 75, minHeight: 50, padding: 10 }}
                  onClick={(e) => { setviadieta(1); e.stopPropagation() }}
                >
                  SONDA NASOENTÉRICA
                </button>
                <button
                  className={viadieta == 2 ? "red-button" : "blue-button"} style={{ width: 150, minWidth: 100, height: 75, minHeight: 50, padding: 10 }}
                  onClick={(e) => { setviadieta(2); e.stopPropagation() }}
                >
                  SONDA OROGÁSTRICA
                </button>
                <button
                  className={viadieta == 3 ? "red-button" : "blue-button"} style={{ width: 150, minWidth: 100, height: 75, minHeight: 50, padding: 10 }}
                  onClick={(e) => { setviadieta(3); e.stopPropagation() }}
                >
                  GASTROSTOMIA
                </button>
                <button
                  className={viadieta == 4 ? "red-button" : "blue-button"} style={{ width: 150, minWidth: 100, height: 75, minHeight: 50, padding: 10 }}
                  onClick={(e) => { setviadieta(4); e.stopPropagation() }}
                >
                  JEJUNOSTOMIA
                </button>
                <button
                  className={viadieta == 5 ? "red-button" : "blue-button"} style={{ width: 150, minWidth: 100, height: 75, minHeight: 50, padding: 10 }}
                  onClick={(e) => { setviadieta(5); e.stopPropagation() }}
                >
                  NUTRIÇÃO PARENTERAL TOTAL
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '90%' }}>
                <div id="INFUSÃO"
                  style={{ display: viadieta != 0 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <div className="title2center">{'INFUSÃO (ml/h):'}</div>
                  <input
                    className="input"
                    autoComplete="off"
                    placeholder="?"
                    title="?"
                    defaultValue={infusaodieta}
                    onFocus={(e) => (e.target.placeholder = '')}
                    onBlur={(e) => (e.target.placeholder = '?')}
                    onChange={(e) => { validateInfusaoDieta(e.target.value); e.stopPropagation() }}
                    style={{
                      height: 50,
                      width: 100,
                      margin: 0,
                      padding: 0,
                    }}
                    id="inputInfusaoDieta"
                    maxLength={3}
                  ></input>
                </div>
                <div id="OBJETIVO"
                  style={{ display: viadieta != 0 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <div className="title2center">{'OBJETIVO (ml/h):'}</div>
                  <input
                    className="input"
                    autoComplete="off"
                    placeholder="?"
                    title="?"
                    defaultValue={getdieta}
                    onFocus={(e) => (e.target.placeholder = '')}
                    onBlur={(e) => (e.target.placeholder = '?')}
                    onChange={(e) => { validateGetDieta(e.target.value); e.stopPropagation() }}
                    style={{
                      height: 50,
                      width: 100,
                      margin: 0,
                      padding: 0,
                    }}
                    id="inputGet"
                    maxLength={3}
                  ></input>
                </div>
              </div>
              <label
                className="title2center"
                style={{ margin: 0, marginTop: 10 }}
              >
                ATUALIZAR POSIÇÃO DA CABECEIRA
              </label>
              <div
                id="CABECEIRA."
                style={{
                  display: 'flex',
                  flexDirection: window.innerWidth > 800 ? 'row' : 'column',
                  justifyContent: 'space-between',
                  margin: 5,
                }}
              >
                <button
                  className={cabeceira == 1 ? "red-button" : "blue-button"}
                  style={{ width: 100, minWidth: 100, height: 100, minHeight: 100 }}
                  onClick={(e) => { setcabeceira(1); e.stopPropagation() }}
                >
                  <img
                    alt=""
                    src={leito0}
                    style={{
                      height: '70%',
                      borderRadius: 5,
                    }}
                  ></img>
                </button>
                <button
                  className={cabeceira == 2 ? "red-button" : "blue-button"}
                  style={{ width: 100, minWidth: 100, height: 100, minHeight: 100 }}
                  onClick={(e) => { setcabeceira(2); e.stopPropagation() }}
                >
                  <img
                    alt=""
                    src={leito30}
                    style={{
                      height: '70%',
                      borderRadius: 5,
                    }}
                  ></img>
                </button>
                <button
                  className={cabeceira == 3 ? "red-button" : "blue-button"}
                  style={{ width: 100, minWidth: 100, height: 100, minHeight: 100 }}
                  onClick={(e) => { setcabeceira(3); e.stopPropagation() }}
                >
                  <img
                    alt=""
                    src={leito90}
                    style={{
                      height: '70%',
                      borderRadius: 5,
                    }}
                  ></img>
                </button>
                <button
                  className={cabeceira == 4 ? "red-button" : "blue-button"}
                  style={{ width: 100, minWidth: 100, height: 100, minHeight: 100 }}
                  onClick={(e) => { setcabeceira(4); e.stopPropagation() }}
                >
                  <img
                    alt=""
                    src={fowler}
                    style={{
                      height: '70%',
                      borderRadius: 5,
                    }}
                  ></img>
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  // validando input da infusão de dieta.
  const validateInfusaoDieta = (txt) => {
    clearTimeout(timeout);
    var last = txt.slice(-1);
    timeout = setTimeout(() => {
      if (isNaN(last) === true) {
        last = '';
        document.getElementById('inputInfusaoDieta').value = '';
      } else {
        setinfusaodieta(document.getElementById('inputInfusaoDieta').value);
        setTimeout(() => {
          document.getElementById('inputInfusaoDieta').focus();
        }, 100);
      }
    }, 1000);
  };

  // validando input da infusão de dieta.
  const validateGetDieta = (txt) => {
    clearTimeout(timeout);
    var last = txt.slice(-1);
    timeout = setTimeout(() => {
      if (isNaN(last) === true) {
        last = '';
        document.getElementById('inputGet').value = '';
      } else {
        setgetdieta(document.getElementById('inputGet').value);
        setTimeout(() => {
          document.getElementById('inputGet').focus();
        }, 100);
      }
    }, 1000);
  };

  const [viewcabeceira, setviewcabeceira] = useState(0);
  // 1 = cabeceira zero graus, 2 = cabeceira 30 graus, 3 = cabeceira a 90 graus, 4 = fowler.
  function ChangeCabeceira() {
    if (viewcabeceira == 1) {
      return (
        <div
          className="menucover"
          onClick={(e) => { setviewcabeceira(0); e.stopPropagation() }}
          style={{
            zIndex: 9, display: 'flex', flexDirection: 'column',
            justifyContent: 'center', alignItems: 'center'
          }}>
          <div className="menucontainer" style={{ padding: 20 }}>
            <label
              className="title2center"
              style={{ margin: 0 }}
            >
              ATUALIZAR POSIÇÃO DA CABECEIRA
            </label>
            <div
              id="CABECEIRA."
              style={{
                display: 'flex',
                flexDirection: window.innerWidth > 800 ? 'row' : 'column',
                justifyContent: 'space-between',
                margin: 5,
              }}
            >
              <button
                className="blue-button" style={{ width: 100, minWidth: 100, height: 100, minHeight: 100 }}
                onClick={(e) => { setcabeceira(1); setviewcabeceira(0); e.stopPropagation() }}
              >
                <img
                  alt=""
                  src={leito0}
                  style={{
                    height: '70%',
                    borderRadius: 5,
                  }}
                ></img>
              </button>
              <button
                className="blue-button" style={{ width: 100, minWidth: 100, height: 100, minHeight: 100 }}
                onClick={(e) => { setcabeceira(2); setviewcabeceira(0); e.stopPropagation() }}
              >
                <img
                  alt=""
                  src={leito30}
                  style={{
                    height: '70%',
                    borderRadius: 5,
                  }}
                ></img>
              </button>
              <button
                className="blue-button" style={{ width: 100, minWidth: 100, height: 100, minHeight: 100 }}
                onClick={(e) => { setcabeceira(3); setviewcabeceira(0); e.stopPropagation() }}
              >
                <img
                  alt=""
                  src={leito90}
                  style={{
                    height: '70%',
                    borderRadius: 5,
                  }}
                ></img>
              </button>
              <button
                className="blue-button" style={{ width: 100, minWidth: 100, height: 100, minHeight: 100 }}
                onClick={(e) => { setcabeceira(4); setviewcabeceira(0); e.stopPropagation() }}
              >
                <img
                  alt=""
                  src={fowler}
                  style={{
                    height: '70%',
                    borderRadius: 5,
                  }}
                ></img>
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  // CARD PARA O IVCF.
  function CardIVCF() {
    return (
      <div id="cardivcf"
        className="pulsewidgetscroll"
        onClick={() => {
          document.getElementById("cardivcf").className = "pulsewidgetscrollmax";
          document.getElementById("cardivcf").style.width = '75vw';
          document.getElementById("cardivcf").style.height = '75vh';
          document.getElementById("cardivcf").style.flexDirection = 'row';
          document.getElementById("cardivcf").style.overflowY = 'scroll';
          document.getElementById("cardivcf").style.overflowX = 'hidden';
        }}>
        <div className="pulsewidgettitle">
          <div className="title4">FRAGILIDADE CLÍNICO-FUNCIONAL</div>
        </div>
        <div className="pulsewidgetcontent"
          style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}
          onClick={(e) => {
            document.getElementById("cardivcf").className = "pulsewidgetscroll";
            document.getElementById("cardivcf").style.width = '11vw';
            document.getElementById("cardivcf").style.height = '11vw';
            document.getElementById("cardivcf").style.overflowY = 'hidden';
            e.stopPropagation();
          }}>
          <AptIVCF></AptIVCF>
        </div>
      </div>
    );
  }

  // CARD PARA GESTÃO DE RISCOS.
  function CardGestaoDeRiscos() {
    return (
      <div id="cardgestaoderiscos"
        className="pulsewidgetscroll"
        onClick={() => {
          document.getElementById("cardgestaoderiscos").className = "pulsewidgetscrollmax";
          document.getElementById("cardgestaoderiscos").style.width = '60vh';
          document.getElementById("cardgestaoderiscos").style.flexDirection = 'row';
          document.getElementById("cardgestaoderiscos").style.overflowY = 'scroll';
          document.getElementById("cardgestaoderiscos").style.overflowX = 'hidden';
        }}>
        <div className="pulsewidgettitle">
          <div className="title4">GESTÃO DE RISCOS</div>
        </div>
        <div className="pulsewidgetcontent"
          style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}
          onClick={(e) => {
            document.getElementById("cardgestaoderiscos").className = "pulsewidgetscroll";
            document.getElementById("cardgestaoderiscos").style.width = '11vw';
            document.getElementById("cardgestaoderiscos").style.overflowY = 'hidden';
            e.stopPropagation();
          }}>
          <CardQueda></CardQueda>
          <CardLesao></CardLesao>
        </div>
      </div>
    );
  }

  function CardQueda() {
    return (
      <div id="cardqueda" className="pulsewidgetstatic" onClick={(e) => { setshowbraden(1); e.stopPropagation() }}>
        <div className="title4" style={{ margin: 0, padding: 0 }}>RISCO DE QUEDA:</div>
        <div className="title2center" style={{ margin: 5, padding: 0 }}>{'BRADEN: ' + newbraden}</div>
        <div className="title2center" style={{ margin: 0, padding: 0 }}>
          {newbraden > 14 ? 'RISCO BAIXO' :
            newbraden > 12 && newbraden < 15 ? 'RISCO MODERADO' :
              newbraden > 9 && newbraden < 13 ? 'RISCO ALTO' :
                newbraden < 10 ? 'RISCO MUITO ALTO' : 'BRADEN ?'}
        </div>
      </div>
    );
  }

  function CardLesao() {
    return (
      <div id="cardlesao" className="pulsewidgetstatic" onClick={(e) => { setshowmorse(1); e.stopPropagation() }}>
        <div className="title4" style={{ margin: 0, padding: 0 }}>RISCO DE LESÃO:</div>
        <div className="title2center" style={{ margin: 5, padding: 0 }}>{'MORSE: ' + newmorse}</div>
        <div className="title2center" style={{ margin: 0, padding: 0 }}>
          {newmorse < 41 ? 'RISCO MÉDIO' : newmorse > 40 && newmorse < 52 ? 'RISCO ELEVADO' : newmorse > 51 ? 'RISCO MUITO ELEVADO' : 'MORSE ?'}
        </div>
      </div>
    );
  }

  // CLASSIFICAÇÃO DE BRADEN (QUEDA).
  const [percepcao, setpercepcao] = useState(4);
  const [umidade, setumidade] = useState(4);
  const [atividade, setatividade] = useState(4);
  const [mobilidade, setmobilidade] = useState(4);
  const [nutricao, setnutricao] = useState(4);
  const [friccao, setfriccao] = useState(3);

  const [newbraden, setnewbraden] = useState(braden);
  const setBraden = () => {
    setnewbraden(percepcao + umidade + atividade + mobilidade + nutricao + friccao);
    setshowbraden(0);
  }

  const [showbraden, setshowbraden] = useState(0);
  function Braden() {
    if (showbraden === 1) {
      return (
        <div className="menucover" style={{ zIndex: 9, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div className="menucontainer">
            <div id="cabeçalho" className="cabecalho">
              <div className="title5">{'ESCALA DE BRADEN'}</div>
              <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <button className="red-button" onClick={() => setshowbraden(0)}>
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
                  onClick={() => setBraden()}
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
              className="corpo">
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginBottom: 5 }}>
                <div className="title2" style={{ fontSize: 14, width: 150, textAlign: 'center' }}>PERCEPÇÃO SENSORIAL:</div>
                <button
                  onClick={() => { setpercepcao(1) }}
                  className={percepcao === 1 ? "red-button" : "blue-button"}
                  style={{ width: 150 }}>
                  TOTALMENTE LIMITADO
                </button>
                <button
                  onClick={() => { setpercepcao(2) }}
                  className={percepcao === 2 ? "red-button" : "blue-button"}
                  style={{ width: 150 }}>
                  MUITO LIMITADO
                </button>
                <button
                  onClick={() => { setpercepcao(3) }}
                  className={percepcao === 3 ? "red-button" : "blue-button"}
                  style={{ width: 150 }}>
                  LEVEMENTE LIMITADO
                </button>
                <button
                  onClick={() => { setpercepcao(4) }}
                  className={percepcao === 4 ? "red-button" : "blue-button"}
                  style={{ width: 150 }}>
                  NENHUMA LIMITAÇÃO
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginBottom: 5 }}>
                <div className="title2" style={{ fontSize: 14, width: 150, textAlign: 'center' }}>UMIDADE:</div>
                <button
                  onClick={() => { setumidade(1) }}
                  className={umidade === 1 ? "red-button" : "blue-button"}
                  style={{ width: 150 }}>
                  COMPLETAMENTE MOLHADO
                </button>
                <button
                  onClick={() => { setumidade(2) }}
                  className={umidade === 2 ? "red-button" : "blue-button"}
                  style={{ width: 150 }}>
                  MUITO MOLHADO
                </button>
                <button
                  onClick={() => { setumidade(3) }}
                  className={umidade === 3 ? "red-button" : "blue-button"}
                  style={{ width: 150 }}>
                  OCASIONALMENTE MOLHADO
                </button>
                <button
                  onClick={() => { setumidade(4) }}
                  className={umidade === 4 ? "red-button" : "blue-button"}
                  style={{ width: 150 }}>
                  RARAMENTE MOLHADO
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginBottom: 5 }}>
                <div className="title2" style={{ fontSize: 14, width: 150, textAlign: 'center' }}>ATIVIDADE:</div>
                <button
                  onClick={() => { setatividade(1) }}
                  className={atividade === 1 ? "red-button" : "blue-button"}
                  style={{ width: 150 }}>
                  ACAMADO
                </button>
                <button
                  onClick={() => { setatividade(2) }}
                  className={atividade === 2 ? "red-button" : "blue-button"}
                  style={{ width: 150 }}>
                  CONFINADO À CADEIRA
                </button>
                <button
                  onClick={() => { setatividade(3) }}
                  className={atividade === 3 ? "red-button" : "blue-button"}
                  style={{ width: 150 }}>
                  ANDA OCASIONALMENTE
                </button>
                <button
                  onClick={() => { setatividade(4) }}
                  className={atividade === 4 ? "red-button" : "blue-button"}
                  style={{ width: 150 }}>
                  ANDA FREQUENTEMENTE
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginBottom: 5 }}>
                <div className="title2" style={{ fontSize: 14, width: 150, textAlign: 'center' }}>MOBILIDADE:</div>
                <button
                  onClick={() => { setmobilidade(1) }}
                  className={mobilidade === 1 ? "red-button" : "blue-button"}
                  style={{ width: 150 }}>
                  TOTALMENTE LIMITADO
                </button>
                <button
                  onClick={() => { setmobilidade(2) }}
                  className={mobilidade === 2 ? "red-button" : "blue-button"}
                  style={{ width: 150 }}>
                  BASTANTE LIMITADO
                </button>
                <button
                  onClick={() => { setmobilidade(3) }}
                  className={mobilidade === 3 ? "red-button" : "blue-button"}
                  style={{ width: 150 }}>
                  LEVEMENTE LIMITADO
                </button>
                <button
                  onClick={() => { setmobilidade(4) }}
                  className={mobilidade === 4 ? "red-button" : "blue-button"}
                  style={{ width: 150 }}>
                  NÃO APRESENTA LIMITAÇÕES
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginBottom: 5 }}>
                <div className="title2" style={{ fontSize: 14, width: 150, textAlign: 'center' }}>NUTRIÇÃO:</div>
                <button
                  onClick={() => { setnutricao(1) }}
                  className={nutricao === 1 ? "red-button" : "blue-button"}
                  style={{ width: 150 }}>
                  MUITO POBRE
                </button>
                <button
                  onClick={() => { setnutricao(2) }}
                  className={nutricao === 2 ? "red-button" : "blue-button"}
                  style={{ width: 150 }}>
                  PROVAVELMENTE INADEQUADA
                </button>
                <button
                  onClick={() => { setnutricao(3) }}
                  className={nutricao === 3 ? "red-button" : "blue-button"}
                  style={{ width: 150 }}>
                  ADEQUADA
                </button>
                <button
                  onClick={() => { setnutricao(4) }}
                  className={nutricao === 4 ? "red-button" : "blue-button"}
                  style={{ width: 150 }}>
                  EXCELENTE
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginBottom: 5 }}>
                <div className="title2" style={{ fontSize: 14, width: 150, textAlign: 'center' }}>FRICÇÃO E CISALHAMENTO:</div>
                <button
                  onClick={() => { setfriccao(1) }}
                  className={friccao === 1 ? "red-button" : "blue-button"}
                  style={{ width: 150 }}>
                  PROBLEMA
                </button>
                <button
                  onClick={() => { setfriccao(2) }}
                  className={friccao === 2 ? "red-button" : "blue-button"}
                  style={{ width: 150 }}>
                  PROBLEMA POTENCIAL
                </button>
                <button
                  onClick={() => { setfriccao(3) }}
                  className={friccao === 3 ? "red-button" : "blue-button"}
                  style={{ width: 150 }}>
                  NENHUM PROBLEMA
                </button>
                <button className="blue-button" disabled="true" style={{ width: 150, opacity: 0.5 }}></button>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  // CLASSIFICAÇÃO DE MORSE (LESÕES).
  const [quedas, setquedas] = useState(0);
  const [diagsec, setdiagsec] = useState(0);
  const [auxilio, setauxilio] = useState(0);
  const [endovenosa, setendovenosa] = useState(0);
  const [marcha, setmarcha] = useState(0);
  const [mental, setmental] = useState(0);

  const [newmorse, setnewmorse] = useState(morse);
  const setMorse = () => {
    setnewmorse(quedas + diagsec + auxilio + endovenosa + marcha + mental);
    setshowmorse(0);
  }

  const [showmorse, setshowmorse] = useState(0);
  function Morse() {
    if (showmorse === 1) {
      return (
        <div className="menucover" style={{ zIndex: 9, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div className="menucontainer">
            <div id="cabeçalho" className="cabecalho">
              <div className="title5">{'ESCALA DE MORSE'}</div>
              <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <button className="red-button" onClick={() => setshowmorse(0)}>
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
                  onClick={() => setMorse()}
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
              className="corpo">
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
                <div className="title2" style={{ fontSize: 14, width: 150, textAlign: 'center' }}>HISTÓRICO DE QUEDAS:</div>
                <button
                  onClick={() => { setquedas(0) }}
                  className={quedas === 0 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  NÃO
                </button>
                <button
                  onClick={() => { setquedas(25) }}
                  className={quedas === 25 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  SIM
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
                <div className="title2" style={{ fontSize: 14, width: 150, textAlign: 'center' }}>DIAGNÓSTICO SECUNDÁRIO:</div>
                <button
                  onClick={() => { setdiagsec(0) }}
                  className={diagsec === 0 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  NÃO
                </button>
                <button
                  onClick={() => { setdiagsec(15) }}
                  className={diagsec === 15 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  SIM
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
                <div className="title2" style={{ fontSize: 14, width: 150, textAlign: 'center' }}>AUXÍLIO NA DEAMBULAÇÃO:</div>
                <button
                  onClick={() => { setauxilio(0) }}
                  className={auxilio === 0 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  NENHUM, ACAMADO OU AUXILIADO POR PROFISSIONAL DE SAÚDE
                </button>
                <button
                  onClick={() => { setauxilio(15) }}
                  className={auxilio === 15 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  MULETAS, BENGALA OU ANDADOR
                </button>
                <button
                  onClick={() => { setauxilio(30) }}
                  className={auxilio === 30 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  MOBILIÁRIO OU PAREDE
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
                <div className="title2" style={{ fontSize: 14, width: 150, textAlign: 'center' }}>TERAPIA ENDOVENOSA OU CATETER VENOSO:</div>
                <button
                  onClick={() => { setendovenosa(0) }}
                  className={endovenosa === 0 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  NÃO
                </button>
                <button
                  onClick={() => { setendovenosa(20) }}
                  className={endovenosa === 20 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  SIM
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
                <div className="title2" style={{ fontSize: 14, width: 150, textAlign: 'center' }}>MARCHA:</div>
                <button
                  onClick={() => { setmarcha(0) }}
                  className={marcha === 0 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  NORMAL, CADEIRANTE OU ACAMADO
                </button>
                <button
                  onClick={() => { setmarcha(10) }}
                  className={marcha === 10 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  FRACA
                </button>
                <button
                  onClick={() => { setmarcha(20) }}
                  className={marcha === 20 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  COMPROMETIDA, CAMBALEANTE
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
                <div className="title2" style={{ fontSize: 14, width: 150, textAlign: 'center' }}>ESTADO MENTAL:</div>
                <button
                  onClick={() => { setmental(0) }}
                  className={mental === 0 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  ORIENTADO E CAPAZ QUANTO A SUA LIMITAÇÃO
                </button>
                <button
                  onClick={() => { setmental(15) }}
                  className={mental === 15 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  SUPERESTIMA CAPACIDADES E ESQUECE LIMITAÇÕES
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  // função que atualiza o paciente.
  const updateAtendimento = () => {
    setloadprincipal(0);
    var obj = {
      idpaciente: idpaciente,
      hospital: nomehospital,
      unidade: nomeunidade,
      box: box,
      admissao: admissao,
      nome: nomepaciente,
      dn: dn,
      peso: peso,
      altura: altura,
      antecedentes: document.getElementById("inputAp").value.toUpperCase(),
      alergias: document.getElementById("inputAlergias").value.toUpperCase(),
      medicacoes: document.getElementById("inputMedprev").value.toUpperCase(),
      exames: document.getElementById("inputExprev").value.toUpperCase(),
      historia: document.getElementById("inputHda").value.toUpperCase(),
      status: stat,
      ativo: ativo,
      classificacao: classificacao,
      descritor: descritor,
      precaucao: null,
      assistente: assistente,
    };
    axios.post(html + '/updateatendimento/' + idatendimento, obj).then(() => {
      setloadprincipal(0);
    });
  };

  // encerrando consulta ambulatorial.
  const encerrarConsulta = () => {
    var obj = {
      idpaciente: idpaciente,
      hospital: nomehospital,
      unidade: nomeunidade,
      box: '',
      admissao: admissao,
      nome: nomepaciente,
      dn: dn,
      peso: peso,
      altura: altura,
      antecedentes: antecedentes,
      alergias: alergias,
      medicacoes: medicacoes,
      exames: exames,
      historia: historia,
      status: 0,
      ativo: 0,
      classificacao: classificacao,
      descritor: descritor,
      precaucao: 0,
      assistente: assistente,
    };
    axios.post(html + '/updateatendimento/' + idatendimento, obj).then(() => {
      history.push('/pacientes')
    });
  };

  // card invasões.
  function CardInvasoes() {
    return (
      <div id="cardinvasao"
        className="pulsewidgetbody"
        style={{ display: cardinvasoes == 1 ? 'flex' : 'none' }}
        onClick={() => document.getElementById("cardinvasao").classList.toggle("pulsewidgetbodyhover")}
      >
        <div className="pulsewidgettitle" style={{ alignItems: 'center' }}>
          <div className="title5">{'INVASÕES'}</div>
          <img
            alt=""
            src={body}
            style={{
              height: '60%',
              // width: 45,
              borderRadius: 5,
            }}
          ></img>
        </div>
        <div
          id="invasaocontent"
          className="pulsewidgetcontent"
        >
          <ShowInvasoes></ShowInvasoes>
        </div>
      </div>
    );
  }

  // card lesoes.
  function CardLesoes() {
    return (
      <div id="cardlesoes"
        style={{ display: cardlesoes == 1 ? 'flex' : 'none' }}
        className="pulsewidgetbody"
        title="LESÕES DE PRESSÃO"
        onClick={() => document.getElementById("cardlesoes").classList.toggle("pulsewidgetbodyhover")}
        onMouseLeave={() => {
          document.getElementById("cardlesoes").scrollTop = 0
        }}
      >
        <div className="pulsewidgettitle" style={{ alignItems: 'center' }}>
          <div className="title5">{'LESÕES'}</div>
          <img
            alt=""
            src={dorso}
            style={{
              height: '60%',
              // width: 45,
              borderRadius: 5,
            }}
          ></img>
        </div>
        <div
          id="lesaocontent"
          className="pulsewidgetcontent"
        >
          <ShowLesoes></ShowLesoes>
        </div>
      </div>
    );
  }

  // COMPONENTE ÚLTIMA EVOLUÇÃO E EXAME FÍSICO.
  function CardEvolucoes() {
    return (
      <div
        id="EVOLUÇÃO E EXAME FÍSICO"
        title="ÚLTIMA EVOLUÇÃO MÉDICA."
        style={{ display: cardultimaevolucao == 1 ? 'flex' : 'none' }}
        className="pulsewidgetscroll"
        onClick={() => document.getElementById("EVOLUÇÃO E EXAME FÍSICO").classList.toggle("pulsewidgetscrollmax")}
      >
        <div className="title4 pulsewidgettitle">
          {'ÚLTIMA EVOLUÇÃO MÉDICA'}
        </div>
        <div className="pulsewidgetcontent" style={{ justifyContent: 'flex-start' }}>
          <div className="title4" style={{ whiteSpace: 'pre-wrap' }}>
            {evolucao != '' ? 'EVOLUÇÃO (' + dataevolucao.toString().substring(0, 8) + ' - ' + dataevolucao.toString().substring(9, 14) + '):' : 'EVOLUÇÃO:'}
          </div>
          <div>
            {evolucao != '' ? evolucao : 'SEM EVOLUÇÕES REGISTRADAS.'}
          </div>
          <div className="title4" style={{ marginTop: 10 }}>{'CONTROLES:'}</div>
          <ViewGlasgow></ViewGlasgow>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', padding: 2.5 }}>
            <ViewRass></ViewRass>
            <ViewRamsay></ViewRamsay>
          </div>
          <div style={{
            display: evolucao != '' ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center',
          }}>
            <div className={pam < 70 ? "title3" : "title2"} style={{ margin: 2.5, padding: 0 }}>{'PA: ' + pas + ' x ' + pad + ' (PAM ' + pam + ') mmHg'}</div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
              <div className={parseInt(fc) < 60 || parseInt(fc) > 120 ? "title3" : "title2"} style={{ margin: 2.5, padding: 0 }}>{'FC: ' + fc + ' bpm'}</div>
              <div className={parseInt(fr) > 26 ? 'title3' : 'title2'} style={{ margin: 2.5, padding: 0 }}>{'FR: ' + fr + ' irpm'}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
              <div className={parseInt(sao2) < 90 ? "title3" : "title2"} style={{ margin: 2.5, padding: 0 }}>{'SAO2: ' + sao2 + '%'}</div>
              <div className={parseFloat(tax) < 35.0 || parseFloat(tax) > 37.5 ? "title3" : "title2"} style={{ margin: 2.5, padding: 0 }}>{'TAX: ' + tax + '°C'}</div>
            </div>
            <div className={diurese12h < 500 ? "title3" : "title2"} style={{ margin: 2.5, padding: 0 }}>{'DIURESE: ' + diurese12h + 'ml/12h'}</div>
            <div className={ganhos12h > 2000 ? "title3" : "title2"} style={{ margin: 2.5, padding: 0 }}>{'GANHOS EM 12H: ' + ganhos12h + 'ml'}</div>
            <div className={perdas12h > 2000 ? "title3" : "title2"} style={{ margin: 2.5, padding: 0 }}>{'PERDAS EM 12H: ' + perdas12h + 'ml'}</div>
            <div className={(ganhos12h - perdas12h) > 2000 || (ganhos12h - perdas12h) < -2000 ? "title3" : "title2"} style={{ margin: 2.5, padding: 0 }}>
              {ganhos12h || perdas12h != '' ? 'BH EM 12H: ' + (ganhos12h - perdas12h) + 'ml' : 'BH 12H: NÃO INFORMADO.'}
            </div>
            <div className={(ganhosacumulados - perdasacumuladas) > 2000 || (ganhosacumulados - perdasacumuladas) < -2000 ? 'title3' : 'title2'} style={{ margin: 2.5, padding: 0 }}>
              {ganhosacumulados || perdasacumuladas != '' ? 'BH ACUMULADO: ' + (ganhosacumulados - perdasacumuladas) + 'ml' : 'BH ACUMULADO: NÃO INFORMADO'}
            </div>
          </div>
          <div style={{ display: evolucao == '' ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center' }}>
            <text style={{ color: '#ffffff' }}>SEM REGISTRO DE DADOS CLÍNICOS.</text>
          </div>
        </div>
      </div>
    );
  }

  const [viewglasgow, setViewglasgow] = useState(0);
  function ViewGlasgow() {
    if (viewglasgow === 1) {
      return (
        <div className="title2" style={{ margin: 2.5, padding: 0 }}>
          {window.innerWidth > 800 ? 'GLASGOW:\n ' + glasgow : 'ECG:\n' + glasgow}
        </div>
      );
    } else {
      return null;
    }
  }
  const [viewrass, setViewrass] = useState(0);
  function ViewRass() {
    if (viewrass === 1) {
      return <div className="title2" style={{ margin: 2.5, padding: 0 }}>{'RASS:\n ' + rass}</div>
    } else {
      return null;
    }
  }
  const [viewramsay, setViewramsay] = useState(0);
  function ViewRamsay() {
    if (viewramsay === 1) {
      return <div className="title2" style={{ margin: 2.5, padding: 0 }}>{'RAMSAY:\n ' + ramsay}</div>
    } else {
      return null;
    }
  }

  // MENU LATERAL.
  // selecionando o menu principal.
  const clickPrincipal = () => {
    // freezeScreen(3000);
    cleanFilters();
    setstateprontuario(1);
    // reposicionando a scroll da tela principal para o topo.
    setscrolllist(0);
    // atualizando informações da tela principal.
    updatePrincipal(idpaciente);
    // exibindo o painel de invasões.
    setshowlesoes(0);
    setshowinvasoes(1);
    // menu da versão mobile.
    setshowmenu(0);
    document.body.style.overflow = null;
  }
  const clickPlanoTerapeutico = () => {
    cleanFilters();
    setstateprontuario(21);
    // menu da versão mobile.
    window.scrollTo(0, 0);
    setshowmenu(0);
    document.body.style.overflow = null;
  }
  const clickEvoluções = () => {
    loadEvolucoes();
    cleanFilters();
    setstateprontuario(2);
    setshowlesoes(0);
    setshowinvasoes(1);
    // menu da versão mobile.
    window.scrollTo(0, 0);
    setshowmenu(0);
    document.body.style.overflow = null;
  }
  const clickEscalas = () => {
    cleanFilters();
    setstateprontuario(20);
    // menu da versão mobile.
    window.scrollTo(0, 0);
    setshowmenu(0);
    document.body.style.overflow = null;
  }
  const clickDiagnosticos = () => {
    cleanFilters();
    setstateprontuario(3);
    setshowlesoes(0);
    setshowinvasoes(1);
    // menu da versão mobile.
    window.scrollTo(0, 0);
    setshowmenu(0);
    document.body.style.overflow = null;
  }
  const clickProblemas = () => {
    cleanFilters();
    setstateprontuario(12);
    setshowlesoes(0);
    setshowinvasoes(1);
    // menu da versão mobile.
    window.scrollTo(0, 0);
    setshowmenu(0);
    document.body.style.overflow = null;
  }
  const clickPropostas = () => {
    cleanFilters();
    setstateprontuario(4);
    setshowlesoes(0);
    setshowinvasoes(1);
    // menu da versão mobile.
    window.scrollTo(0, 0);
    setshowmenu(0);
    document.body.style.overflow = null;
  }
  const clickInterconsultas = () => {
    cleanFilters();
    setstateprontuario(5);
    setshowlesoes(0);
    setshowinvasoes(1);
  }
  const clickLaboratorio = () => {
    cleanFilters();
    setstateprontuario(6);
    setshowlesoes(0);
    setshowinvasoes(1);
    // menu da versão mobile.
    window.scrollTo(0, 0);
    setshowmenu(0);
    document.body.style.overflow = null;
  }
  const clickImagem = () => {
    cleanFilters();
    setstateprontuario(7);
    setshowlesoes(0);
    setshowinvasoes(1);
    // menu da versão mobile.
    window.scrollTo(0, 0);
    setshowmenu(0);
    document.body.style.overflow = null;
  }
  const clickBalanco = () => {
    cleanFilters();
    setstateprontuario(8);
    getSomaGanhos();
    getSomaPerdas();
    getDiurese12h();
    getBh12h();
    getBhAcumulado();
    loadBalancos();
    setshowlesoes(0);
    setshowinvasoes(1);
  }
  const [newprescricao, setnewprescricao] = useState(0);
  const clickPrescricoes = () => {
    // exibição das prescrições para os médicos.
    if (tipousuario != 4) {
      cleanFilters();
      setnewprescricao(0);
      setstateprontuario(9);
      // exibição da checagem de prescrições para os técnicos de enfermagem.
    } else {
      cleanFilters();
      setshowinvasoes(1);
      setstateprontuario(10);
    }
  }
  const clickFormularios = () => {
    cleanFilters();
    setstateprontuario(11);
    setshowlesoes(0);
    setshowinvasoes(1);
  }
  // limpando filtros...
  const cleanFilters = () => {
    setfilterevolucao('');
    setfilterdiagnostico('');
    setfilterproblema('');
    setfilterproposta('');
    setfilterinterconsulta('');
    setfilterlaboratorio('');
    setfilterimagem('');
  }

  // modulando as animações css para os menus (trabalhoso, mas faz toda a dierença).
  const setActive = (btn, btnAdd) => {
    var botoes = document.getElementById("MENU LATERAL").getElementsByClassName("red-button");
    for (var i = 0; i < botoes.length; i++) {
      botoes.item(i).className = "blue-button";
    }
    var addBotoes = document.getElementById("MENU LATERAL").getElementsByClassName("animated-red-button");
    for (var i = 0; i < addBotoes.length; i++) {
      addBotoes.item(i).className = "animated-blue-button";
    }
    document.getElementById(btn).className = "red-button"
    document.getElementById(btnAdd).className = "animated-red-button";
  }

  // usando useCallback para impedir rerenderizações desnecessárias e impedir a mudança de scroll.
  const Menu = useCallback(() => {
    return (
      <div className="menu"
      >
        <div style={{
          display: 'flex',
          flexDirection: 'row', justifyContent: 'center',
          margin: 20, marginBottom: 10
        }}>
          <Logo height={0.13 * window.innerHeight} width={0.13 * window.innerHeight}></Logo>
          <div className="title2 logo"
            style={{
              opacity: 1, margin: 0, marginTop: 35, marginLeft: -10, color: 'white', fontSize: 18
            }}
          >
            gPulse
          </div>
        </div>
        <div
          className="scrollmenu"
          id="MENU LATERAL"
        >
          <div
            id="menuPrincipal"
            className="menuitemanimation"
          >
            <button
              id="btnPrincipal"
              className="red-button"
              onClick={() => {
                clickPrincipal();
                var botoes = document.getElementById("MENU LATERAL").getElementsByClassName("red-button");
                for (var i = 0; i < botoes.length; i++) {
                  botoes.item(i).className = "blue-button";
                }
                document.getElementById("btnPrincipal").className = "red-button"
              }}
              style={{
                width: '100%',
                height: 50,
              }}
            >
              PRINCIPAL
            </button>
          </div>
          <div
            id="menuPlanoTerapeutico"
            className="menuitemanimation"
          >
            <button
              id="btnPlanoTerapeutico"
              className="blue-button"
              onClick={() => {
                clickPlanoTerapeutico();
                var botoes = document.getElementById("MENU LATERAL").getElementsByClassName("red-button");
                for (var i = 0; i < botoes.length; i++) {
                  botoes.item(i).className = "blue-button";
                }
                document.getElementById("btnPlanoTerapeutico").className = "red-button"
              }}
              style={{
                width: '100%',
                height: 50,
              }}
            >
              PLANO TERAPÊUTICO
            </button>
          </div>
          <div
            className="secondary"
            style={{ display: tipounidade == 4 ? 'flex' : 'none', flexDirection: 'row', marginTop: 0, marginBottom: 5, width: '100%', boxShadow: 'none' }}
          >
            <button
              className="orange-button"
              onClick={() => encerrarConsulta()}
              style={{
                width: '100%',
                height: 50,
              }}
            >
              ENCERRAR CONSULTA
            </button>
          </div>
          <div
            id="menuEvolucoes"
            className="menuitemanimation"
            style={{ display: menuevolucoes == 1 ? 'flex' : 'none' }}
          >
            <button
              id="btnEvolucoes"
              className="blue-button"
              onClick={() => { clickEvoluções(); setActive("btnEvolucoes", "btnAddEvolucoes"); }}
              style={{
                width: '100%',
                height: 50,
              }}
            >
              EVOLUÇÕES
            </button>
            <button
              id="btnAddEvolucoes"
              className="animated-blue-button"
              title="ADICIONAR EVOLUÇÃO."
              onClick={() => viewEvolucao(1)}
            >
              <img
                alt=""
                src={novo}
                style={{
                  margin: 10,
                  height: 20,
                  width: 20,
                }}
              ></img>
            </button>
          </div>

          <div
            id="menuEscalas"
            className="menuitemanimation"
            style={{ display: menuevolucoes == 1 ? 'flex' : 'none' }}
          >
            <button
              id="btnEscalas"
              className="blue-button"
              onClick={() => {
                clickEscalas();
                var botoes = document.getElementById("MENU LATERAL").getElementsByClassName("red-button");
                for (var i = 0; i < botoes.length; i++) {
                  botoes.item(i).className = "blue-button";
                }
                document.getElementById("btnEscalas").className = "red-button"
              }}
              style={{
                width: '100%',
                height: 50,
              }}
            >
              ESCALAS
            </button>
          </div>

          <div
            id="menuDiagnosticos"
            className="menuitemanimation"
            style={{ display: menudiagnosticos == 1 ? 'flex' : 'none' }}
          >
            <button
              id="btnDiagnosticos"
              className="blue-button"
              disabled={tipousuario == 1 || tipousuario == 2 ? false : true}
              onClick={() => { clickDiagnosticos(); setActive("btnDiagnosticos", "btnAddDiagnosticos"); }}
              style={{
                width: '100%',
                height: 50,
                opacity: tipousuario == 1 || tipousuario == 2 ? 1 : 0.5,
              }}
            >
              {window.innerWidth > 400 ? 'DIAGNÓSTICOS' : 'DIAGN.'}
            </button>
            <button
              id="btnAddDiagnosticos"
              className="animated-blue-button"
              disabled={tipousuario == 1 || tipousuario == 2 ? false : true}
              title="ADICIONAR DIAGNÓSTICO."
              onClick={() => viewDiagnostico(1)}
            >
              <img
                alt=""
                src={novo}
                style={{
                  margin: 10,
                  height: 20,
                  width: 20,
                }}
              ></img>
            </button>
          </div>
          <div
            id="menuProblemas"
            className="menuitemanimation"
            style={{ display: menuproblemas == 1 ? 'flex' : 'none' }}
          >
            <button
              id="btnProblemas"
              className="blue-button"
              disabled={tipousuario == 1 || tipousuario == 2 ? false : true}
              onClick={() => { clickProblemas(); setActive("btnProblemas", "btnAddProblemas"); }}
              style={{
                width: '100%',
                height: 50,
                opacity: tipousuario == 1 || tipousuario == 2 ? 1 : 0.5,
              }}
            >
              PROBLEMAS
            </button>
            <button
              id="btnAddProblemas"
              className="animated-blue-button"
              disabled={tipousuario == 1 || tipousuario == 2 ? false : true}
              title="ADICIONAR PROBLEMA."
              onClick={() => viewProblema(1)}
            >
              <img
                alt=""
                src={novo}
                style={{
                  margin: 10,
                  height: 20,
                  width: 20,
                }}
              ></img>
            </button>
          </div>
          <div
            id="menuProprostas"
            className="menuitemanimation"
            style={{ display: menupropostas == 1 ? 'flex' : 'none' }}
          >
            <button
              id="btnPropostas"
              className="blue-button"
              disabled={tipousuario == 1 || tipousuario == 2 ? false : true}
              onClick={() => { clickPropostas(); setActive("btnPropostas", "btnAddPropostas") }}
              style={{
                width: '100%',
                height: 50,
                opacity: tipousuario == 1 || tipousuario == 2 ? 1 : 0.5,
              }}
            >
              PROPOSTAS
            </button>
            <button
              id="btnAddPropostas"
              className="animated-blue-button"
              disabled={tipousuario == 1 || tipousuario == 2 ? false : true}
              title="ADICIONAR PROPOSTA."
              onClick={() => viewProposta(1)}
            >
              <img
                alt=""
                src={novo}
                style={{
                  margin: 10,
                  height: 20,
                  width: 20,
                }}
              ></img>
            </button>
          </div>
          <div
            id="menuInterconsultas"
            className="menuitemanimation"
            style={{ display: menuinterconsultas == 1 ? 'flex' : 'none' }}
          >
            <button
              id="btnInterconsultas"
              className="blue-button"
              disabled={tipousuario == 1 || tipousuario == 2 ? false : true}
              onClick={() => { clickInterconsultas(); setActive("btnInterconsultas", "btnAddInterconsultas") }}
              style={{
                width: '100%',
                height: 50,
                opacity: tipousuario == 1 || tipousuario == 2 ? 1 : 0.5,
              }}
            >
              INTERCONSULTAS
            </button>
            <button
              id="btnAddInterconsultas"
              className="animated-blue-button"
              disabled={tipousuario == 1 || tipousuario == 2 ? false : true}
              title="SOLICITAR INTERCONSULTA."
              onClick={() => viewInterconsulta(1)}
            >
              <img
                alt=""
                src={novo}
                style={{
                  margin: 10,
                  height: 20,
                  width: 20,
                }}
              ></img>
            </button>
          </div>
          <div
            id="menuLaboratorio"
            className="menuitemanimation"
            style={{ display: menulaboratorio == 1 ? 'flex' : 'none' }}
          >
            <button
              id="btnLaboratorio"
              className="blue-button"
              disabled={tipousuario == 1 || tipousuario == 2 ? false : true}
              onClick={() => { clickLaboratorio(); setActive("btnLaboratorio", "btnAddLaboratorio") }}
              style={{
                width: '100%',
                height: 50,
                opacity: tipousuario == 1 || tipousuario == 2 ? 1 : 0.5,
              }}
            >
              LABORATÓRIO
            </button>
            <button
              id="btnAddLaboratorio"
              className="animated-blue-button"
              disabled={tipousuario == 1 || tipousuario == 2 ? false : true}
              title="SOLICITAR EXAMES LABORATORIAIS."
              onClick={() => viewLaboratorio()}
            >
              <img
                alt=""
                src={novo}
                style={{
                  margin: 10,
                  height: 20,
                  width: 20,
                }}
              ></img>
            </button>
          </div>
          <div
            id="menuImagens"
            className="menuitemanimation"
            style={{ display: menuimagem == 1 ? 'flex' : 'none' }}
          >
            <button
              id="btnImagens"
              className="blue-button"
              disabled={tipousuario == 1 || tipousuario == 2 ? false : true}
              onClick={() => { clickImagem(); setActive("btnImagens", "btnAddImagens"); }}
              style={{
                width: '100%',
                height: 50,
                opacity: tipousuario == 1 || tipousuario == 2 ? 1 : 0.5,
              }}
            >
              IMAGEM
            </button>
            <button
              id="btnAddImagens"
              className="animated-blue-button"
              disabled={tipousuario == 1 || tipousuario == 2 ? false : true}
              title="SOLICITAR EXAME DE IMAGEM."
              onClick={() => viewImagem()}
            >
              <img
                alt=""
                src={novo}
                style={{
                  margin: 10,
                  height: 20,
                  width: 20,
                }}
              ></img>
            </button>
          </div>
          <div
            id="menuBalanco"
            className="menuitemanimation"
            style={{
              display: tipousuario == 4 ? 'flex' : 'none',
            }}
          >
            <button
              id="btnBalanco"
              className="blue-button"
              onClick={() => { clickBalanco(); setActive("btnBalanco", "btnAddBalanco"); }}
              style={{
                width: '100%',
                height: 50,
              }}
            >
              BALANÇOS
            </button>
            <button
              id="btnAddBalanco"
              className="animated-blue-button"
              title="NOVO REGISTRO DE BALANÇO HÍDRICO."
              onClick={() => newBalanco()}
            >
              <img
                alt=""
                src={novo}
                style={{
                  margin: 10,
                  height: 20,
                  width: 20,
                }}
              ></img>
            </button>
          </div>
          <div
            id="menuPrescricao"
            className="menuitemanimation"
            style={{ display: tipousuario != 4 && menuprescricao == 1 ? 'flex' : 'none' }}
          >
            <button
              id="btnPrescricoes"
              className="blue-button"
              onClick={() => { clickPrescricoes(); setActive("btnPrescricoes", "btnAddPrescricoes") }}
              style={{
                width: '100%',
                height: 50,
              }}
            >
              PRESCRIÇÃO
            </button>
            <button
              id="btnAddPrescricoes"
              className="animated-blue-button"
              disabled={tipousuario == 1 || tipousuario == 2 ? false : true}
              title="ADICIONAR PRESCRIÇÃO."
              onClick={() => addPrescription()}
            >
              <img
                alt=""
                src={novo}
                style={{
                  margin: 10,
                  height: 20,
                  width: 20,
                }}
              ></img>
            </button>
          </div>
          <div
            id="menuCheckPrescricoes"
            className="menuitemanimation"
            style={{ display: tipousuario == 4 && menuprescricao == 1 ? 'flex' : 'none' }}
          >
            <button
              id="btnCheckPrescricoes"
              className="blue-button"
              onClick={() => {
                clickPrescricoes();
                var botoes = document.getElementById("MENU LATERAL").getElementsByClassName("red-button");
                for (var i = 0; i < botoes.length; i++) {
                  botoes.item(i).className = "blue-button";
                }
                var addBotoes = document.getElementById("MENU LATERAL").getElementsByClassName("animated-red-button");
                for (var i = 0; i < addBotoes.length; i++) {
                  addBotoes.item(i).className = "animated-blue-button";
                }
                document.getElementById("btnCheckPrescricoes").className = "red-button"
              }}
              style={{
                width: '100%',
                height: 50,
              }}
            >
              PRESCRIÇÃO
            </button>
          </div>
          <div
            id="menuFormularios"
            className="menuitemanimation"
            style={{ display: menuformularios == 1 ? 'flex' : 'none' }}
          >
            <button
              id="btnFormularios"
              className="blue-button"
              onClick={() => { clickFormularios(); setActive("btnFormularios", "btnAddFormularios"); }}
              style={{
                opacity: tipousuario == 4 ? 0.3 : 1,
                width: '100%',
                height: 50,
              }}
            >
              FORMULÁRIOS
            </button>
            <button
              id="btnAddFormularios"
              className="animated-blue-button"
              title="CRIAR FORMULÁRIO."
              onClick={() => viewFormulario(1)}
            >
              <img
                alt=""
                src={novo}
                style={{
                  margin: 10,
                  height: 20,
                  width: 20,
                }}
              ></img>
            </button>
          </div>
        </div>
      </div >
    );
  }, [menuevolucoes, menudiagnosticos, menuproblemas, menupropostas, menuinterconsultas, menulaboratorio, menuimagem]
  );

  // INVASÕES.
  // MENU PARA SELEÇÃO DE DISPOSITIVOS INVASIVOS.
  const [invasaomenu, setinvasaomenu] = useState(0);
  function ShowInvasaoMenu() {
    if (invasaomenu === 1) {
      return (
        <div
          className="menuposition" onClick={() => setinvasaomenu(0)}>
          <div className="menucontainer" style={{ padding: 10 }}>
            <div className="title2center" style={{ width: 150, marginBottom: 10 }}>VIA AÉREA</div>
            <div
              id="datepicker"
              className="grey-button"
              style={{
                width: 150,
                height: 50,
                marginBottom: 10,
              }}
              onClick={(e) => { showDatePicker(1, 1); e.stopPropagation() }}
            >
              {pickdate1}
            </div>
            <div style={{
              display: 'flex', flexWrap: 'wrap', width: window.innerWidth > 800 ? '' : 320,
              flexDirection: window.innerWidth > 800 ? 'column' : 'row',
              justifyContent: 'center'
            }}>
              <div id="OPÇÕES SNC" style={{
                display: localdispositivo == 'SNC' ? 'flex' : 'none'
              }}>
                {arraydispositivossnc.map((item) => (
                  <button
                    onClick={() => updateInvasoes(item)}
                    className="blue-button"
                    style={{ width: window.innerWidth > 800 ? 150 : 75, margin: 2.5 }}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div id="OPÇÕES VA" style={{ display: localdispositivo == 'VA' ? 'flex' : 'none' }}>
                {arraydispositivosva.map((item) => (
                  <button
                    onClick={() => updateInvasoes(item)}
                    className="blue-button"
                    style={{ width: window.innerWidth > 800 ? 150 : 75, margin: 2.5 }}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div id="OPÇÕES CVC" style={{
                display:
                  localdispositivo == 'JID' ||
                    localdispositivo == 'JIE' ||
                    localdispositivo == 'SUBCLD' ||
                    localdispositivo == 'SUBCLE' ||
                    localdispositivo == 'VFEMD' ||
                    localdispositivo == 'VFEME'
                    ? 'flex' : 'none'
              }}>
                {arraydispositivosvasc.map((item) => (
                  <button
                    onClick={() => updateInvasoes(item)}
                    className="blue-button"
                    style={{ width: window.innerWidth > 800 ? 150 : 75, margin: 2.5 }}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div id="OPÇÕES PIA"
                style={{
                  display:
                    localdispositivo == 'ARD' || // artéria radial direita
                      localdispositivo == 'ARE' || // artéria radial esquerda
                      localdispositivo == 'AFEMD' || // artéria femoral direita
                      localdispositivo == 'AFEME' || // artéria femoral esquerda
                      localdispositivo == 'APD' || // artéria pediosa direita
                      localdispositivo == 'APE' // artéria pediosa esquerda
                      ? 'flex' : 'none'
                }}>
                {arraydispositivospia.map((item) => (
                  <button
                    onClick={() => updateInvasoes(item)}
                    className="blue-button"
                    style={{ width: window.innerWidth > 800 ? 150 : 75, margin: 2.5 }}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div id="OPÇÕES URO"
                style={{
                  display: localdispositivo == 'URO' ? 'flex' : 'none'
                }}>
                {arraydispositivosuro.map((item) => (
                  <button
                    onClick={() => updateInvasoes(item)}
                    className="blue-button"
                    style={{ width: window.innerWidth > 800 ? 150 : 75, margin: 2.5 }}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div id="OPÇÕES TORAX"
                style={{
                  display:
                    localdispositivo == 'TORAXD' || // torax à direita
                      localdispositivo == 'TORAXE' || // torax à esquerda
                      localdispositivo == 'MED' // mediastino
                      ? 'flex' : 'none'
                }}>
                {arraydispositivostorax.map((item) => (
                  <button
                    onClick={() => updateInvasoes(item)}
                    className="blue-button"
                    style={{ width: window.innerWidth > 800 ? 150 : 75, margin: 2.5 }}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div id="OPÇÕES ABD"
                style={{
                  display:
                    localdispositivo == 'ABD1' || // local aleatório no abdome
                      localdispositivo == 'ABD2' || // local aleatório no abdome
                      localdispositivo == 'ABD3' // local aleatório no abdome
                      ? 'flex' : 'none'
                }}>
                {arraydispositivosabd.map((item) => (
                  <button
                    onClick={() => updateInvasoes(item)}
                    className="blue-button"
                    style={{ width: window.innerWidth > 800 ? 150 : 75, margin: 2.5 }}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <button
                onClick={() => updateInvasoes('')}
                className="blue-button"
                style={{ width: window.innerWidth > 800 ? 150 : 75, margin: 2.5 }}
              >
                LIMPAR
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }


  // MARCADORES DE INVASÕES NO MANEQUIM.
  // SISTEMA NERVOSO CENTRAL (SNC).
  function ShowSnc() {
    return (
      <div
        className="green-invasion snc"
        title={'DATA DE INSERÇÃO: ' +
          listinvasoes.filter(item => item.local == 'SNC' && item.datatermino == null).map(item => moment(item.datainicio).format('DD/MM/YY'))
        }
        style={{
          height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
        }}
        onClick={() => {
          setpickdate1(moment().format('DD/MM/YYYY'));
          setlocaldispositivo('SNC');
          setinvasaomenu(1)
        }}
      >
        {listinvasoes.filter(item => item.local == 'SNC' && item.datatermino == null).map(item => item.dispositivo)}
      </div>
    );
  }
  // VIA AÉREA (VA).
  function ShowVa() {
    return (
      <div
        className="orange-invasion va"
        title={'DATA DE INSERÇÃO: ' +
          listinvasoes.filter(item => item.local == 'VA' && item.datatermino == null).map(item => moment(item.datainicio).format('DD/MM/YY'))
        }
        style={{
          height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
        }}
        onClick={() => {
          setpickdate1(moment().format('DD/MM/YYYY'));
          setlocaldispositivo('VA');
          setinvasaomenu(1)
        }}
      >
        <div className="title2center" style={{ color: '#ffffff', fontSize: 12 }}>
          {listinvasoes.filter(item => item.local == 'VA' && item.datatermino == null).map(item => item.dispositivo)}
        </div>
      </div>
    );
  }
  // JUGULAR INTERNA DIREITA (JID).
  function ShowJid() {
    return (
      <div
        className="blue-invasion jid"
        title={'DATA DE INSERÇÃO: ' +
          listinvasoes.filter(item => item.local == 'JID' && item.datatermino == null).map(item => moment(item.datainicio).format('DD/MM/YY'))
        }
        style={{
          height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
        }}
        onClick={() => {
          setpickdate1(moment().format('DD/MM/YYYY'));
          setlocaldispositivo('JID');
          setinvasaomenu(1)
        }}
      >
        {listinvasoes.filter(item => item.local == 'JID' && item.datatermino == null).map(item => item.dispositivo)}
      </div>
    );
  }
  // JUGULAR INTERNA ESQUERDA (JIE).
  function ShowJie() {
    return (
      <div
        className="blue-invasion jie"
        title={'DATA DE INSERÇÃO: ' +
          listinvasoes.filter(item => item.local == 'JIE' && item.datatermino == null).map(item => moment(item.datainicio).format('DD/MM/YY'))
        }
        style={{
          height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
        }}
        onClick={() => {
          setpickdate1(moment().format('DD/MM/YYYY'));
          setlocaldispositivo('JIE');
          setinvasaomenu(1)
        }}
      >
        {listinvasoes.filter(item => item.local == 'JIE' && item.datatermino == null).map(item => item.dispositivo)}
      </div>
    );
  }
  // SUBCLÁVIA DIREITA (SUBCLD).
  function ShowSubcld() {
    return (
      <div
        className="blue-invasion subcld"
        title={'DATA DE INSERÇÃO: ' +
          listinvasoes.filter(item => item.local == 'SUBCLD' && item.datatermino == null).map(item => moment(item.datainicio).format('DD/MM/YY'))
        }
        style={{
          height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
        }}
        onClick={() => {
          setpickdate1(moment().format('DD/MM/YYYY'));
          setlocaldispositivo('SUBCLD');
          setinvasaomenu(1)
        }}
      >
        {listinvasoes.filter(item => item.local == 'SUBCLD' && item.datatermino == null).map(item => item.dispositivo)}
      </div>
    );
  }
  // SUBCLÁVIA ESQUERDA (SUBCLE).
  function ShowSubcle() {
    return (
      <div
        className="blue-invasion subcle"
        title={'DATA DE INSERÇÃO: ' +
          listinvasoes.filter(item => item.local == 'SUBCLE' && item.datatermino == null).map(item => moment(item.datainicio).format('DD/MM/YY'))
        }
        style={{
          height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
        }}
        onClick={() => {
          setpickdate1(moment().format('DD/MM/YYYY'));
          setlocaldispositivo('SUBCLE');
          setinvasaomenu(1)
        }}
      >
        {listinvasoes.filter(item => item.local == 'SUBCLE' && item.datatermino == null).map(item => item.dispositivo)}
      </div>
    );
  }
  // FEMORAL DIREITA (VFEMD).
  function ShowVfemd() {
    return (
      <div
        className="blue-invasion vfemd"
        title={'DATA DE INSERÇÃO: ' +
          listinvasoes.filter(item => item.local == 'VFEMD' && item.datatermino == null).map(item => moment(item.datainicio).format('DD/MM/YY'))
        }
        style={{
          height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
        }}
        onClick={() => {
          setpickdate1(moment().format('DD/MM/YYYY'));
          setlocaldispositivo('VFEMD');
          setinvasaomenu(1)
        }}
      >
        {listinvasoes.filter(item => item.local == 'VFEMD' && item.datatermino == null).map(item => item.dispositivo)}
      </div>
    );
  }
  // FEMORAL DIREITA (VFEMD).
  function ShowVfeme() {
    return (
      <div
        className="blue-invasion vfeme"
        title={'DATA DE INSERÇÃO: ' +
          listinvasoes.filter(item => item.local == 'VFEME' && item.datatermino == null).map(item => moment(item.datainicio).format('DD/MM/YY'))
        }
        style={{
          height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
        }}
        onClick={() => {
          setpickdate1(moment().format('DD/MM/YYYY'));
          setlocaldispositivo('VFEME');
          setinvasaomenu(1)
        }}
      >
        {listinvasoes.filter(item => item.local == 'VFEME' && item.datatermino == null).map(item => item.dispositivo)}
      </div>
    );
  }
  // ARTÉRIA RADIAL DIREITA (ARD).
  function ShowArd() {
    return (
      <div
        className="red-invasion piaard"
        title={'DATA DE INSERÇÃO: ' +
          listinvasoes.filter(item => item.local == 'ARD' && item.datatermino == null).map(item => moment(item.datainicio).format('DD/MM/YY'))
        }
        style={{
          height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
        }}
        onClick={() => {
          setpickdate1(moment().format('DD/MM/YYYY'));
          setlocaldispositivo('ARD');
          setinvasaomenu(1)
        }}
      >
        {listinvasoes.filter(item => item.local == 'ARD' && item.datatermino == null).map(item => item.dispositivo)}
      </div>
    );
  }
  // ARTÉRIA RADIAL ESQUERDA (ARE).
  function ShowAre() {
    return (
      <div
        className="red-invasion piaare"
        title={'DATA DE INSERÇÃO: ' +
          listinvasoes.filter(item => item.local == 'ARE' && item.datatermino == null).map(item => moment(item.datainicio).format('DD/MM/YY'))
        }
        style={{
          height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
        }}
        onClick={() => {
          setpickdate1(moment().format('DD/MM/YYYY'));
          setlocaldispositivo('ARE');
          setinvasaomenu(1)
        }}
      >
        {listinvasoes.filter(item => item.local == 'ARE' && item.datatermino == null).map(item => item.dispositivo)}
      </div>
    );
  }
  // ARTÉRIA FEMORAL DIREITA (AFD).
  function ShowAfd() {
    return (
      <div
        className="red-invasion afemd"
        title={'DATA DE INSERÇÃO: ' +
          listinvasoes.filter(item => item.local == 'AFD' && item.datatermino == null).map(item => moment(item.datainicio).format('DD/MM/YY'))
        }
        style={{
          height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
        }}
        onClick={() => {
          setpickdate1(moment().format('DD/MM/YYYY'));
          setlocaldispositivo('AFD');
          setinvasaomenu(1)
        }}
      >
        {listinvasoes.filter(item => item.local == 'AFD' && item.datatermino == null).map(item => item.dispositivo)}
      </div>
    );
  }
  // ARTÉRIA FEMORAL DIREITA (AFD).
  function ShowAfe() {
    return (
      <div
        className="red-invasion afeme"
        title={'DATA DE INSERÇÃO: ' +
          listinvasoes.filter(item => item.local == 'AFE' && item.datatermino == null).map(item => moment(item.datainicio).format('DD/MM/YY'))
        }
        style={{
          height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
        }}
        onClick={() => {
          setpickdate1(moment().format('DD/MM/YYYY'));
          setlocaldispositivo('AFE');
          setinvasaomenu(1)
        }}
      >
        {listinvasoes.filter(item => item.local == 'AFE' && item.datatermino == null).map(item => item.dispositivo)}
      </div>
    );
  }
  // ARTÉRIA PEDIOSA DIREITA (APD).
  function ShowApd() {
    return (
      <div
        className="red-invasion piapedd"
        title={'DATA DE INSERÇÃO: ' +
          listinvasoes.filter(item => item.local == 'APD' && item.datatermino == null).map(item => moment(item.datainicio).format('DD/MM/YY'))
        }
        style={{
          height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
        }}
        onClick={() => {
          setpickdate1(moment().format('DD/MM/YYYY'));
          setlocaldispositivo('APD');
          setinvasaomenu(1)
        }}
      >
        {listinvasoes.filter(item => item.local == 'APD' && item.datatermino == null).map(item => item.dispositivo)}
      </div>
    );
  }
  // ARTÉRIA PEDIOSA ESQUERDA (APE).
  function ShowApe() {
    return (
      <div
        className="red-invasion piapede"
        title={'DATA DE INSERÇÃO: ' +
          listinvasoes.filter(item => item.local == 'APE' && item.datatermino == null).map(item => moment(item.datainicio).format('DD/MM/YY'))
        }
        style={{
          height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
        }}
        onClick={() => {
          setpickdate1(moment().format('DD/MM/YYYY'));
          setlocaldispositivo('APE');
          setinvasaomenu(1)
        }}
      >
        {listinvasoes.filter(item => item.local == 'APE' && item.datatermino == null).map(item => item.dispositivo)}
      </div>
    );
  }
  // SONDA VESICAL DE DEMORA (SVD).
  function ShowSvd() {
    return (
      <div
        className="yellow-invasion svd"
        title={'DATA DE INSERÇÃO: ' +
          listinvasoes.filter(item => item.local == 'URO' && item.datatermino == null).map(item => moment(item.datainicio).format('DD/MM/YY'))
        }
        style={{
          height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
        }}
        onClick={() => {
          setpickdate1(moment().format('DD/MM/YYYY'));
          setlocaldispositivo('URO');
          setinvasaomenu(1)
        }}
      >
        {listinvasoes.filter(item => item.local == 'URO' && item.datatermino == null).map(item => item.dispositivo)}
      </div>
    );
  }
  // DRENOS TORÁCICOS.
  function ShowToraxD() {
    return (
      <div
        className="green-invasion toraxd"
        title={'DATA DE INSERÇÃO: ' +
          listinvasoes.filter(item => item.local == 'TORAXD' && item.datatermino == null).map(item => moment(item.datainicio).format('DD/MM/YY'))
        }
        style={{
          height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
        }}
        onClick={() => {
          setpickdate1(moment().format('DD/MM/YYYY'));
          setlocaldispositivo('TORAXD');
          setinvasaomenu(1)
        }}
      >
        {listinvasoes.filter(item => item.local == 'TORAXD' && item.datatermino == null).map(item => item.dispositivo)}
      </div>
    );
  }
  function ShowToraxE() {
    return (
      <div
        className="green-invasion toraxe"
        title={'DATA DE INSERÇÃO: ' +
          listinvasoes.filter(item => item.local == 'TORAXE' && item.datatermino == null).map(item => moment(item.datainicio).format('DD/MM/YY'))
        }
        style={{
          height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
        }}
        onClick={() => {
          setpickdate1(moment().format('DD/MM/YYYY'));
          setlocaldispositivo('TORAXE');
          setinvasaomenu(1)
        }}
      >
        {listinvasoes.filter(item => item.local == 'TORAXE' && item.datatermino == null).map(item => item.dispositivo)}
      </div>
    );
  }
  function ShowToraxM() {
    return (
      <div
        className="green-invasion toraxm"
        title={'DATA DE INSERÇÃO: ' +
          listinvasoes.filter(item => item.local == 'TORAXM' && item.datatermino == null).map(item => moment(item.datainicio).format('DD/MM/YY'))
        }
        style={{
          height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
        }}
        onClick={() => {
          setpickdate1(moment().format('DD/MM/YYYY'));
          setlocaldispositivo('TORAXM');
          setinvasaomenu(1)
        }}
      >
        {listinvasoes.filter(item => item.local == 'TORAXM' && item.datatermino == null).map(item => item.dispositivo)}
      </div>
    );
  }
  // DRENOS ABDOMINAIS.
  function ShowAbd1() {
    return (
      <div
        className="green-invasion abd1"
        title={'DATA DE INSERÇÃO: ' +
          listinvasoes.filter(item => item.local == 'ABD1' && item.datatermino == null).map(item => moment(item.datainicio).format('DD/MM/YY'))
        }
        style={{
          height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
        }}
        onClick={() => {
          setpickdate1(moment().format('DD/MM/YYYY'));
          setlocaldispositivo('ABD1');
          setinvasaomenu(1)
        }}
      >
        {listinvasoes.filter(item => item.local == 'ABD1' && item.datatermino == null).map(item => item.dispositivo)}
      </div>
    );
  }
  function ShowAbd2() {
    return (
      <div
        className="green-invasion abd2"
        title={'DATA DE INSERÇÃO: ' +
          listinvasoes.filter(item => item.local == 'ABD2' && item.datatermino == null).map(item => moment(item.datainicio).format('DD/MM/YY'))
        }
        style={{
          height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
        }}
        onClick={() => {
          setpickdate1(moment().format('DD/MM/YYYY'));
          setlocaldispositivo('ABD2');
          setinvasaomenu(1)
        }}
      >
        {listinvasoes.filter(item => item.local == 'ABD2' && item.datatermino == null).map(item => item.dispositivo)}
      </div>
    );
  }
  function ShowAbd3() {
    return (
      <div
        className="green-invasion abd3"
        title={'DATA DE INSERÇÃO: ' +
          listinvasoes.filter(item => item.local == 'ABD3' && item.datatermino == null).map(item => moment(item.datainicio).format('DD/MM/YY'))
        }
        style={{
          height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
        }}
        onClick={() => {
          setpickdate1(moment().format('DD/MM/YYYY'));
          setlocaldispositivo('ABD3');
          setinvasaomenu(1)
        }}
      >
        {listinvasoes.filter(item => item.local == 'ABD3' && item.datatermino == null).map(item => item.dispositivo)}
      </div>
    );
  }

  // RENDERIZAÇÃO DAS INVASÕES.
  const [showinvasoes, setshowinvasoes] = useState(1)
  function ShowInvasoes() {
    return (
      <div
        disabled={tipousuario == 4 ? true : false}
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          width: '100%'
        }}
      >
        <div
          id="invasoes"
          disabled={tipousuario == 4 ? () => true : false}
          style={{
            position: 'sticky',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 5,
            marginLeft: 0,
            marginRight: 0,
          }}
        >
          <div
            id="ancora"
            className="boneco"
            style={{
              width: window.innerWidth > 800 ? 0.18 * window.innerWidth : '100%',
              height: window.innerWidth < 800 ? 0.85 * window.innerHeight : '100%',
              marginBottom: window.innerWidth > 800 ? 0 : 5,
            }}
          >
            <ShowSnc></ShowSnc>
            <ShowVa></ShowVa>
            <ShowJid></ShowJid>
            <ShowJie></ShowJie>
            <ShowSubcld></ShowSubcld>
            <ShowSubcle></ShowSubcle>
            <ShowVfemd></ShowVfemd>
            <ShowVfeme></ShowVfeme>
            <ShowArd></ShowArd>
            <ShowAre></ShowAre>
            <ShowAfd></ShowAfd>
            <ShowAfe></ShowAfe>
            <ShowApd></ShowApd>
            <ShowApe></ShowApe>
            <ShowToraxD></ShowToraxD>
            <ShowToraxE></ShowToraxE>
            <ShowToraxM></ShowToraxM>
            <ShowAbd1></ShowAbd1>
            <ShowAbd2></ShowAbd2>
            <ShowAbd3></ShowAbd3>
            <ShowSvd></ShowSvd>
            <img
              alt=""
              src={body}
              style={{
                margin: 5,
                padding: 0,
                width: window.innerWidth > 800 ? 0.18 * window.innerWidth : '',
                height: window.innerWidth < 800 ? 0.85 * window.innerHeight : '',
              }}
            ></img>
          </div>
        </div>
      </div >
    );
  };

  // function Cabeçalho.
  function Filtros() {
    return (
      <div id="CABEÇALHO + IDENTIFICAÇÃO"
        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 10, margin: 0, width: '100%' }}>
        <ShowFilterEvolucao></ShowFilterEvolucao>
        <ShowFilterDiagnosticos></ShowFilterDiagnosticos>
        <ShowFilterProblemas></ShowFilterProblemas>
        <ShowFilterProposta></ShowFilterProposta>
        <ShowFilterInterconsultas></ShowFilterInterconsultas>
        <ShowFilterLaboratorio></ShowFilterLaboratorio>
        <ShowFilterImagem></ShowFilterImagem>
        <ShowFilterFormularios></ShowFilterFormularios>
      </div>
    );
  }

  // renderizando a tela UPDATE ATENDIMENTO.
  const viewUpdateAtendimento = () => {
    setviewupdateatendimento(0);
    setTimeout(() => {
      setviewupdateatendimento(1);
    }, 500);
  }

  // renderizando a tela INSERIR OU ATUALIZAR EVOLUÇÃO.
  function viewEvolucao(valor) {
    setviewevolucao(0);
    setTimeout(() => {
      setviewevolucao(valor); // 1 para inserir evolução, 2 para atualizar evolução.
    }, 500);
  }

  // renderizando a impressão de uma evolução selecionada.
  const viewPrintEvolucao = (item) => {
    setviewprintevolucao(0);
    setTimeout(() => {
      selectedEvolucaoToPrint(item);
      setviewprintevolucao(1); // 1 para inserir evolução, 2 para atualizar evolução.
    }, 500);
  }
  const selectedEvolucaoToPrint = (item) => {
    setidevolucao(item.id);
    setdataevolucao(item.data);
    setevolucao(item.evolucao);
    setpas(item.pas);
    setpad(item.pad);
    setfc(item.fc);
    setfr(item.fr);
    setsao2(item.sao2);
    settax(item.tax);
    setdiu(item.diu);
    setfezes(item.fezes);
    setbh(item.bh);
    setacv(item.acv);
    setar(item.ap);
    setabdome(item.abdome);
    setoutros(item.outros);
    setglasgow(item.glasgow);
    setrass(item.rass);
    setramsay(item.ramsay);
    sethd(item.hd);
    setuf(item.uf);
    setheparina(item.heparina);
    setbraden(item.braden);
    setmorse(item.morse);
    setviewprintevolucao(1);
  }

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

  // LISTA DE FORMULÁRIOS.
  const loadFormularios = () => {
    axios.get(html + "/formularios/" + idpaciente).then((response) => {
      var x = [0, 1];
      x = response.data;
      setlistformularios(x.sort((a, b) => moment(a.data, 'DD/MM/YYYY HH:MM') < moment(b.data, 'DD/MM/YYYY HH:MM') ? 1 : -1).filter(item => item.idatendimento == idatendimento));
      setarrayformularios(x.sort((a, b) => moment(a.data, 'DD/MM/YYYY HH:MM') < moment(b.data, 'DD/MM/YYYY HH:MM') ? 1 : -1).filter(item => item.idatendimento == idatendimento));
    });
  }

  // atualizando um registro de formulário.
  const [idformulario, setidformulario] = useState();
  const [dataformulario, setdataformulario] = useState();
  const [tipoformulario, settipoformulario] = useState();
  const [textoformulario, settextoformulario] = useState();
  const [statusformulario, setstatusformulario] = useState();
  const updateFormulario = (item, valor) => {
    setidformulario(item.id);
    setdataformulario(item.data);
    settipoformulario(item.tipo);
    settextoformulario(item.texto);
    setstatusformulario(item.status);
    viewFormulario(valor);
  }

  // deletando um formulário.
  const deleteFormulario = (item) => {
    axios.get(html + "/deleteformulario/" + item.id).then(() => { loadFormularios() });
  }
  // assinando um formulário.
  const signFormulario = (item) => {
    var obj = {
      idatendimento: item.idatendimento,
      data: item.data,
      tipo: item.tipo,
      texto: item.texto,
      idusuario: item.idusuario,
      usuario: item.usuario,
      status: 1, // assinado.
    };
    axios.post(html + '/updateformulario/' + item.id, obj).then(() => { loadFormularios() });
  };
  // suspendendo um formulário assinando.
  const suspendFormulario = (item) => {
    var obj = {
      idatendimento: item.idatendimento,
      data: item.data,
      tipo: item.tipo,
      texto: item.texto,
      idusuario: item.idusuario,
      usuario: item.usuario,
      status: 2, // suspenso.
    };
    axios.post(html + '/updateformulario/' + item.id, obj).then(() => { loadFormularios() });
  };
  // copiando um formulário assinando.
  const copyFormulario = (item) => {
    var obj = {
      idatendimento: item.idatendimento,
      data: moment().format('DD/MM/YY HH:mm'),
      tipo: item.tipo,
      texto: item.texto,
      idusuario: item.idusuario,
      usuario: item.usuario,
      status: 0,
    };
    axios.post(html + '/insertformulario', obj).then(() => { loadFormularios() });
  };

  // filtro para os formulários.
  function ShowFilterFormularios() {
    if (stateprontuario === 11) {
      return (
        <div style={{ display: 'flex', flexDirection: 'row', margin: 5 }}>
          <input
            className="input"
            autoComplete="off"
            placeholder="BUSCAR DOCUMENTO..."
            onFocus={(e) => (e.target.placeholder = '')}
            onBlur={(e) => (e.target.placeholder = 'BUSCAR DOCUMENTO...')}
            onChange={() => filterFormulario()}
            style={{
              width: '100%',
              margin: 0,
            }}
            type="text"
            id="inputFilterFormulario"
            defaultValue={filterformulario}
            maxLength={100}
          ></input>
        </div >
      )
    } else {
      return null;
    }
  }

  const [filterformulario, setfilterformulario] = useState('');
  var searchformulario = '';

  const filterFormulario = () => {
    clearTimeout(timeout);
    document.getElementById("inputFilterFormulario").focus();
    searchformulario = document.getElementById("inputFilterFormulario").value.toUpperCase();
    timeout = setTimeout(() => {
      if (searchformulario === '') {
        setarrayformularios(listformularios);
        document.getElementById("inputFilterFormulario").value = '';
        document.getElementById("inputFilterFormulario").focus();
      } else {
        setfilterformulario(document.getElementById("inputFilterFormulario").value.toUpperCase());
        setarrayformularios(listformularios.filter(item => item.tipo.includes(searchformulario) === true));
        document.getElementById("inputFilterFormulario").value = searchformulario;
        document.getElementById("inputFilterFormulario").focus();
      }
      if (window.innerWidth < 400) {
        document.getElementById("identificação").style.display = "none";
        document.getElementById("inputFilterFormulario").focus();
      }
    }, 500);
  }

  // exibição da lista de formulários.
  const ShowFormularios = useCallback(() => {
    if (stateprontuario == 11) {
      return (
        <div
          id="formulários"
          className="conteudo" style={{ justifyContent: 'flex-start' }}
        >
          <Filtros></Filtros>
          <div
            className="scroll"
            style={{ width: '100%', height: '90%', backgroundColor: 'transparent', borderColor: 'transparent' }}
            id="LISTA DE FORMULÁRIOS"
          >
            {arrayformularios.map((item) => (
              <p
                key={item.id}
                id="item da lista"
                className="row"
                style={{
                  opacity: item.status === 2 ? 0.3 : '',
                  flexDirection: 'column',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <button
                    className="green-button"
                    style={{
                      margin: 2.5,
                      padding: 10,
                      flexDirection: 'column',
                      backgroundColor: '#52be80',
                    }}
                  >
                    <div>{item.data}</div>
                  </button>
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                    <button className="animated-yellow-button"
                      style={{ display: item.status === 0 ? 'flex' : 'none' }}
                      onClick={() => updateFormulario(item, 2)}
                      title="EDITAR FORMULÁRIO"
                    >
                      <img
                        alt=""
                        src={editar}
                        style={{
                          margin: 10,
                          height: 30,
                          width: 30,
                        }}
                      ></img>
                    </button>
                    <button className="animated-green-button"
                      style={{ display: item.status === 0 ? 'flex' : 'none' }}
                      onClick={() => signFormulario(item)}
                      title="ASSINAR FORMULÁRIO"
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
                    <button className="animated-green-button"
                      style={{ display: item.status === 1 ? 'flex' : 'none' }}
                      title="COPIAR FORMULÁRIO"
                      onClick={() => copyFormulario(item)}
                    >
                      <img
                        alt=""
                        src={copiar}
                        style={{
                          margin: 10,
                          height: 30,
                          width: 30,
                        }}
                      ></img>
                    </button>
                    <button className="animated-green-button"
                      style={{ display: item.status === 1 ? 'flex' : 'none' }}
                      title="IMPRIMIR FORMULÁRIO"
                      onClick={() => viewPrintFormulario(item)}
                    >
                      <img
                        alt=""
                        src={imprimir}
                        style={{
                          margin: 10,
                          height: 30,
                          width: 30,
                        }}
                      ></img>
                    </button>
                    <button className="animated-red-button"
                      onClick={() => suspendFormulario(item)}
                      title="SUSPENDER FORMULÁRIO"
                      style={{ display: item.status === 1 ? 'flex' : 'none', marginRight: 0 }}
                    >
                      <img
                        alt=""
                        src={suspender}
                        style={{
                          margin: 10,
                          height: 30,
                          width: 30,
                        }}
                      ></img>
                    </button>
                    <button
                      id={"deletekey 0 " + item.id}
                      className="animated-red-button"
                      onClick={(e) => { deletetoast(deleteFormulario, item); e.stopPropagation() }}
                      title="DELETAR FORMULÁRIO"
                      style={{ display: item.status === 0 ? 'flex' : 'none' }}
                    >
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
                    <button
                      id={"deletekey 1 " + item.id}
                      style={{ display: 'none', width: 100 }}
                      className="animated-red-button"
                      onClick={(e) => { deletetoast(deleteFormulario, item); e.stopPropagation() }}
                    >
                      <div>DESFAZER</div>
                      <div className="deletetoast"
                        style={{
                          height: 5, borderRadius: 5, backgroundColor: 'pink', alignSelf: 'flex-start',
                          marginLeft: 5, marginRight: 5, maxWidth: 90,
                        }}>
                      </div>
                    </button>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left' }}>
                  <div
                    className="title2"
                    onClick={item.status !== 2 ? () => updateFormulario(item, 3) : ''}
                    title={item.status !== 2 ? "DOCUMENTO REGISTRADO POR " + item.usuario + ". CLIQUE PARA VISUALIZAR." : "DOCUMENTO CANCELADO POR " + item.usuario + ". CLIQUE PARA VISUALIZAR."}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      textAlign: 'left',
                      width: '100%',
                      marginBottom: 0,
                    }}
                  >
                    {item.tipo}
                  </div>
                  <div
                    className="title2"
                    style={{
                      marginTop: 0, justifyContent: 'flex-start',
                      textAlign: 'left',
                      opacity: 0.5,
                    }}>
                    {item.status !== 2 ? "DOCUMENTO REGISTRADO POR " + item.usuario + "." : "DOCUMENTO CANCELADO POR " + item.usuario + "."}</div>
                </div>
              </p>
            ))}
          </div>
        </div >
      );
    } else {
      return null;
    }
  }, [stateprontuario, arrayformularios]);

  // renderizando a tela INSERIR FORMULÁRIO.
  const viewFormulario = (valor) => {
    setviewformulario(0);
    setTimeout(() => {
      setviewformulario(valor); // 1 para novo formulário, 2 para editar formulário.
    }, 500);
  }

  // renderizando a tela IMPRIMIR FORMULÁRIO.
  const [viewprintformulario, setviewprintformulario] = useState(0);
  const viewPrintFormulario = (item) => {
    setidformulario(item.id);
    setdataformulario(item.data);
    settipoformulario(item.tipo);
    settextoformulario(item.texto);
    setstatusformulario(item.status);
    setviewprintformulario(0);
    setTimeout(() => {
      setviewprintformulario(1);
    }, 500);
  }

  // PRESCRIÇÃO.

  // função que abre o menu para adição de uma prescrição (em branco, modelos, hemotransfusão).
  const addPrescription = () => {
    setnewprescricao(0);
    setTimeout(() => {
      cleanFilters();
      setstateprontuario(9);
      setnewprescricao(1);
    }, 300);
  }

  // 13/04/2021 - EXIBIÇÃO DAS LESÕES DE PRESSÃO.
  // chave seletora para exibição de INVASÕES x LESÕES no boneco.
  const [showlesoes, setshowlesoes] = useState(0);
  const clickLesoes = () => {
    if (showlesoes == 0) {
      loadLesoes();
      setshowlesoes(1);
      setshowinvasoes(0);
      setscrollmenu(0);
      setscrolllist(0);
    } else {
      setshowlesoes(0);
      setshowinvasoes(1);
    }
  }
  function BtnLesoesInvasoes() {
    return (
      <button
        className="blue-button"
        title={showlesoes == 1 ? 'LESÕES' : 'DISPOSITIVOS INVASIVOS'}
        style={{
          display: stateprontuario == 9 ? 'none' : 'flex',
          padding: 2.5,
          position: 'absolute',
          top: 10,
          right: 10,
        }}
        onClick={() => clickLesoes()}
      >
        <img
          alt=""
          src={showlesoes === 1 ? curativo : invasoes}
          style={{
            margin: 0,
            padding: 1.5,
            width: window.innerWidth > 800 ? 40 : 30,
            height: window.innerWidth > 800 ? 40 : 30,
          }}
        ></img>
      </button>
    );
  }

  // exibição do boneco com as lesões de pressão.
  function ShowLesoes() {
    return (
      <div
        disabled={tipousuario == 4 ? true : false}
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          width: '100%'
        }}
      >
        <div
          id="lesões"
          style={{
            position: 'sticky',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 5,
            marginLeft: 0,
            marginRight: 0,
          }}
        >
          <div
            id="ancora"
            className="boneco"
            style={{
              width: window.innerWidth > 800 ? 0.18 * window.innerWidth : '100%',
              height: window.innerWidth < 800 ? 0.85 * window.innerHeight : '100%',
              marginBottom: window.innerWidth > 800 ? 0 : 5,
            }}
          >
            <ShowOccipital></ShowOccipital>
            <ShowOmbroD></ShowOmbroD>
            <ShowOmbroE></ShowOmbroE>
            <ShowEscapulaD></ShowEscapulaD>
            <ShowEscapulaE></ShowEscapulaE>
            <ShowCotoveloD></ShowCotoveloD>
            <ShowCotoveloE></ShowCotoveloE>
            <ShowSacral></ShowSacral>
            <ShowIsquioD></ShowIsquioD>
            <ShowIsquioE></ShowIsquioE>
            <ShowTrocanterD></ShowTrocanterD>
            <ShowTrocanterE></ShowTrocanterE>
            <ShowJoelhoD></ShowJoelhoD>
            <ShowJoelhoE></ShowJoelhoE>
            <ShowMaleoloD></ShowMaleoloD>
            <ShowMaleoloE></ShowMaleoloE>
            <ShowHaluxD></ShowHaluxD>
            <ShowHaluxE></ShowHaluxE>
            <ShowCalcaneoD></ShowCalcaneoD>
            <ShowCalcaneoE></ShowCalcaneoE>
            <ShowOrelhaD></ShowOrelhaD>
            <ShowOrelhaE></ShowOrelhaE>
            <img
              alt=""
              src={dorso}
              style={{
                margin: 5,
                padding: 10,
                width: window.innerWidth > 800 ? 0.18 * window.innerWidth : '',
                height: window.innerWidth < 800 ? 0.85 * window.innerHeight : '',
              }}
            ></img>
          </div>
        </div>
      </div>
    );
  }

  // LESÕES
  // carregando o registro de lesoes.
  const [lesoes, setlesoes] = useState([]);
  const loadLesoes = () => {
    axios.get(htmlghaplesoes + idatendimento).then((response) => {
      var x = [0, 1];
      x = response.data;
      setlesoes(x.rows);
      console.log('LESÕES ATIVAS: ' + lesoes.length);
    });
  }

  // limpando formulário que exibe as informaçoes das lesões de pressão.
  const limpalesoes = (local) => {
    setidlesao(0);
    setlocallesao(local);
    setgraulesao(0);
    setdescricaolesao('');
    settratamentolesao('');
    setdatainiciolesao(moment().format('DD/MM/YYYY'));
    setdataterminolesao();
  }

  // definindo e exibindo as informações sobre a lesão (estágio, observações e curativo/tratamento).
  const [idlesao, setidlesao] = useState(0);
  const [locallesao, setlocallesao] = useState('');
  const [graulesao, setgraulesao] = useState('');
  const [descricaolesao, setdescricaolesao] = useState('');
  const [tratamentolesao, settratamentolesao] = useState('');
  const [datainiciolesao, setdatainiciolesao] = useState('');
  const [dataterminolesao, setdataterminolesao] = useState('');
  const clickLesao = (lesao) => {
    setpickdate1('');
    setpickdate2('');
    setlocallesao(lesao);
    // verificando se existe lesão ativa e mapeando suas informações.
    if (lesoes.filter((item) => item.lesao == lesao && item.datatermino == null).length > 0) {
      let x = lesoes.filter((item) => item.lesao == lesao && item.datatermino == null);
      console.log('LESÃO: ' + lesao + '. LENGHT: ' + x.length);
      setTimeout(() => {
        setidlesao(x.map(item => item.id));
        setlocallesao(x.map(item => item.lesao));
        setgraulesao(x.map(item => item.grau));
        setdescricaolesao(x.map(item => item.descricao));
        settratamentolesao(x.map(item => item.grau));
        setdatainiciolesao(x.map(item => item.datainicio));
        setdataterminolesao(x.map(item => item.datatermino));
        setshowinfolesoes(1);
      }, 100);
    } else {
      setlocallesao(lesao);
      setgraulesao(0);
      setdescricaolesao('DESCREVA A LESÃO AQUI.');
      settratamentolesao('SELECIONE');
      setdatainiciolesao(moment());
      setdataterminolesao(null);
      setshowinfolesoes(1);
    }
  }

  const updateLesoes = () => {
    var x = lesoes.filter(item => item.lesao == locallesao && item.datatermino == null);
    var id = x.map(item => item.id);
    if (x.lenght > 0) {
      // atualizando o registro existente como encerrado.
      var obj = {
        idpct: idpaciente,
        idatendimento: idatendimento,
        lesao: locallesao,
        grau: x.map(item => item.grau),
        descricao: x.map(item => item.descricao),
        tratamento: x.map(item => item.tratamento),
        datainicio: x.map(item => item.datainicio),
        datatermino: moment(),
        idprofissional: 0,
      };
      axios.post(htmlghapupdatelesao + id, obj).then(() => {
        // inserindo registro de lesão com os dados inputados.
        var obj = {
          idpct: idpaciente,
          idatendimento: idatendimento,
          lesao: locallesao,
          grau: graulesao,
          descricao: descricaolesao,
          tratamento: tratamentolesao,
          datainicio: datainiciolesao,
          datatermino: moment(),
          idprofissional: 0,
        };
        axios.post(htmlghapinsertlesao, obj).then(() => {
          loadLesoes();
          setshowinfolesoes(0);
        });
      });
    } else {
      // inserindo o primeiro registro de lesão.
      var obj = {
        idpct: idpaciente,
        idatendimento: idatendimento,
        lesao: locallesao,
        grau: graulesao,
        descricao: descricaolesao,
        tratamento: tratamentolesao,
        datainicio: datainiciolesao,
        datatermino: null,
        idprofissional: 0,
      };
      axios.post(htmlghapinsertlesao, obj).then(() => {
        loadLesoes();
        setshowinfolesoes(0);
      });
    }
  }

  var curativos = [
    'RAYNON',
    'FILME TRANSPARENTE',
    'HIDROCOLÓIDE',
    'HIDROGEL',
    'ALGINATO DE CÁLCIO',
    'PAPAÍNA',
    'COLAGENASE',
    'CARVÃO ATIVADO COM PRATA',
    'ESPUMA COM PRATA',
    'PLACA DE PRATA',
    'MATRIZ DE COLÁGENO',
    'MATRIZ DE CELULOSE',
    'PELE ALÓGENA'
  ]

  const selectCurativo = (item) => {
    settratamentolesao(item);
    setshowcurativoslist(0);
  }

  const [showcurativoslist, setshowcurativoslist] = useState(0);
  function ShowCurativosList() {
    if (showcurativoslist == 1) {
      return (
        <div className="menucover">
          <div className="menucontainer">
            <div
              className="scroll"
              id="LISTA DE CURATIVOS"
              style={{
                zIndex: 9,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                margin: 5,
                padding: 0,
                paddingRight: 5,
                height: 200,
                minHeight: 200,
                minWidth: window.innerWidth > 800 ? 0.30 * window.innerWidth : 0.80 * window.innerWidth,
                width: window.innerWidth > 800 ? 0.30 * window.innerWidth : 0.80 * window.innerWidth
              }}
            >
              {curativos.map((item) => (
                <p
                  key={item.id}
                  id="item da lista"
                  className="row"
                  style={{ margin: 5, marginTop: 2.5, marginBottom: 2.5, width: '100%' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
                      <button
                        className={tratamentolesao == item ? "red-button" : "blue-button"}
                        onClick={() => selectCurativo(item)}
                        style={{
                          width: '100%',
                          margin: 2.5,
                          marginLeft: 5,
                          marginRight: 0,
                          flexDirection: 'column',
                          backgroundColor: '#1f7a8c',
                        }}
                      >
                        <div>{item}</div>
                      </button>
                    </div>
                  </div>
                </p>
              ))}
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  const [showinfolesoes, setshowinfolesoes] = useState(0);
  function ShowInfoLesoes() {
    if (showinfolesoes === 1) {
      return (
        <div className="menucover" style={{ zIndex: 9, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div className="menucontainer">
            <div id="cabeçalho" className="cabecalho">
              <div className="title5">{'LESÃO ' + locallesao}</div>
              <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <button className="red-button" onClick={() => setshowinfolesoes(0)}>
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
                  onClick={() => updateLesoes()}
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
              className="corpo">
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', mrginRight: 10 }}>
                  <label className="title2">ABERTURA:</label>
                  <button
                    id="datepicker1"
                    className="grey-button"
                    style={{
                      width: 150,
                      height: 50,
                    }}
                    onClick={() => showDatePicker(1, 1)}
                  >
                    {pickdate1 == '' ? moment(datainiciolesao).format('DD/MM/YYYY') : pickdate1}
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <label className="title2">FECHAMENTO:</label>
                  <div
                    id="datepicker2"
                    className="grey-button"
                    style={{
                      width: 150,
                      height: 50,
                    }}
                    onClick={() => showDatePicker(1, 2)}
                  >
                    {pickdate2 == '' ? moment(dataterminolesao).format('DD/MM/YYY') : pickdate2}
                  </div>
                </div>
              </div>
              <label className="title2" style={{ marginTop: 15 }}>
                ESTÁGIO DA LESÃO:
              </label>
              <div style={{ display: 'flex', flexDirection: window.innerWidth > 800 ? 'row' : 'column', justifyContent: 'center' }}>
                <button
                  className={graulesao == 1 ? "red-button" : "blue-button"}
                  onClick={() => setgraulesao(1)}
                  style={{ width: 150 }}
                >
                  ESTÁGIO 1
                </button>
                <button
                  className={graulesao == 2 ? "red-button" : "blue-button"}
                  onClick={() => setgraulesao(2)}
                  style={{ width: 150 }}
                >
                  ESTÁGIO 2
                </button>
                <button
                  className={graulesao == 3 ? "red-button" : "blue-button"}
                  onClick={() => setgraulesao(3)}
                  style={{ width: 150 }}
                >
                  ESTÁGIO 3
                </button>
                <button
                  className={graulesao == 4 ? "red-button" : "blue-button"}
                  onClick={() => setgraulesao(4)}
                  style={{ width: 150 }}
                >
                  ESTÁGIO 4
                </button>
                <button
                  className={graulesao == 5 ? "red-button" : "blue-button"}
                  onClick={() => setgraulesao(5)}
                  style={{ width: 150, padding: 10 }}
                >
                  NÃO CLASSIFICÁVEL
                </button>
              </div>
              <label className="title2" style={{ marginTop: 15 }}>
                CURATIVO:
              </label>
              <button
                className="blue-button"
                onClick={() => setshowcurativoslist(1)}
                style={{ paddingLeft: 10, paddingRight: 10, width: '100%' }}
              >
                {tratamentolesao}
              </button>
              <label className="title2" style={{ marginTop: 15 }}>
                OBSERVAÇÕES:
              </label>
              <textarea
                autoComplete="off"
                className="textarea"
                placeholder="OBSERVAÇÕES."
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'OBSERVAÇÕES.')}
                onMouseLeave={(e) => setdescricaolesao(e.target.value)}
                title="INFORMAR AQUI OBSERVAÇÕES E OUTROS DETALHES REFERENTES À LESÃO."
                style={{
                  width: '100%',
                  minHeight: tipousuario === 1 || 5 ? 125 : 290, // médico ou enfermeira.
                }}
                type="text"
                maxLength={200}
                defaultValue={descricaolesao}
                id="inputObservacoesLesao"
              ></textarea>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  // exibição das lesões no boneco.
  function ShowOccipital() {
    var x = lesoes.filter(item => item.lesao == 'OCCIPITAL' && item.datatermino == null);
    if (x.length > 0) {
      return (
        <div
          className="red-invasion"
          title={' LESÃO OCCIPITAL \nESTÁGIO: ' + x.map(item => item.grau)}
          style={{
            position: 'absolute',
            top: '4%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          }}
          onClick={() => clickLesao('OCCIPITAL')}
        >
          {x.map(item => item.grau)}
        </div>
      );
    } else {
      return (
        <div
          className="green-invasion"
          title={'OCCIPITAL'}
          style={{
            position: 'absolute',
            top: '4%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            opacity: 0.5,
          }}
          onClick={() => clickLesao('OCCIPITAL')}
        >
        </div>
      );
    }
  }

  function ShowOmbroD() {
    var x = lesoes.filter(item => item.lesao == 'OMBRO DIREITO' && item.datatermino == null);
    if (x.length > 0) {
      return (
        <div
          className="red-invasion"
          title={'LESÃO EM OMBRO DIREITO \nESTÁGIO: ' + x.map(item => item.grau)}
          style={{
            position: 'absolute',
            top: '18%',
            right: '25%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          }}
          onClick={() => clickLesao('OMBRO DIREITO')}
        >
          {x.map(item => item.grau)}
        </div>
      );
    } else {
      return (
        <div
          className="green-invasion"
          title={'OMBRO DIREITO'}
          style={{
            position: 'absolute',
            top: '18%',
            right: '25%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            opacity: 0.5,
          }}
          onClick={() => clickLesao('OMBRO DIREITO')}
        >
        </div>
      );
    }
  }

  function ShowOmbroE() {
    var x = lesoes.filter(item => item.lesao == 'OMBRO ESQUERDO' && item.datatermino == null);
    if (x.length > 0) {
      return (
        <div
          className="red-invasion"
          title={'LESÃO EM OMBRO ESQUERDO \nESTÁGIO: ' + x.map(item => item.grau)}
          style={{
            position: 'absolute',
            top: '18%',
            left: '25%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          }}
          onClick={() => clickLesao('OMBRO ESQUERDO')}
        >
          {x.map(item => item.grau)}
        </div>
      );
    } else {
      return (
        <div
          className="green-invasion"
          title={'OMBRO ESQUERDO'}
          style={{
            position: 'absolute',
            top: '18%',
            left: '25%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            opacity: 0.5,
          }}
          onClick={() => clickLesao('OMBRO ESQUERDO')}
        >
        </div>
      );
    }
  }

  function ShowEscapulaD() {
    var x = lesoes.filter(item => item.lesao == 'ESCAPULA DIREITA' && item.datatermino == null);
    if (x.length > 0) {
      return (
        <div
          className="red-invasion"
          title={'LESÃO EM ESCÁPULA DIREITA \nESTÁGIO: ' + x.map(item => item.grau)}
          style={{
            position: 'absolute',
            top: '25%',
            left: '55%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          }}
          onClick={() => clickLesao('ESCAPULA DIREITA')}
        >
          {x.map(item => item.grau)}
        </div>
      );
    } else {
      return (
        <div
          className="green-invasion"
          title={'ESCAPULA DIREITA'}
          style={{
            position: 'absolute',
            top: '25%',
            left: '55%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            opacity: 0.5,
          }}
          onClick={() => clickLesao('ESCAPULA DIREITA')}
        >
        </div>
      );
    }
  }

  function ShowEscapulaE() {
    var x = lesoes.filter(item => item.lesao == 'ESCAPULA ESQUERDA' && item.datatermino == null);
    if (x.length > 0) {
      return (
        <div
          className="red-invasion"
          title={'LESÃO EM ESCÁPULA ESQUERDA \nESTÁGIO: ' + x.map(item => item.grau)}
          style={{
            position: 'absolute',
            top: '25%',
            right: '55%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          }}
          onClick={() => clickLesao('ESCAPULA ESQUERDA')}
        >
          {x.map(item => item.grau)}
        </div>
      );
    } else {
      return (
        <div
          className="green-invasion"
          title={'ESCAPULA ESQUERDA'}
          style={{
            position: 'absolute',
            top: '25%',
            right: '55%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            opacity: 0.5,
          }}
          onClick={() => clickLesao('ESCAPULA ESQUERDA')}
        >
        </div>
      );
    }
  }

  function ShowCotoveloD() {
    var x = lesoes.filter(item => item.lesao == 'COTOVELO DIREITO' && item.datatermino == null);
    if (x.length > 0) {
      return (
        <div
          className="red-invasion"
          title={'LESÃO EM COTOVELO DIREITO \nESTÁGIO: ' + x.map(item => item.grau)}
          style={{
            position: 'absolute',
            top: '35%',
            left: '75%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          }}
          onClick={() => clickLesao('COTOVELO DIREITO')}
        >
          {x.map(item => item.grau)}
        </div>
      );
    } else {
      return (
        <div
          className="green-invasion"
          title={'COTOVELO DIREITO'}
          style={{
            position: 'absolute',
            top: '35%',
            left: '75%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            opacity: 0.5,
          }}
          onClick={() => clickLesao('COTOVELO DIREITO')}
        >
        </div>
      );
    }
  }

  function ShowCotoveloE() {
    var x = lesoes.filter(item => item.lesao == 'COTOVELO ESQUERDO' && item.datatermino == null);
    if (x.length > 0) {
      return (
        <div
          className="red-invasion"
          title={'LESÃO EM COTOVELO ESQUERDO \nESTÁGIO: ' + x.map(item => item.grau)}
          style={{
            position: 'absolute',
            top: '35%',
            right: '75%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          }}
          onClick={() => clickLesao('COTOVELO ESQUERDO')}
        >
          {x.map(item => item.grau)}
        </div>
      );
    } else {
      return (
        <div
          className="green-invasion"
          title={'COTOVELO ESQUERDO'}
          style={{
            position: 'absolute',
            top: '35%',
            right: '75%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            opacity: 0.5,
          }}
          onClick={() => clickLesao('COTOVELO ESQUERDO')}
        >
        </div>
      );
    }
  }

  function ShowSacral() {
    var x = lesoes.filter(item => item.lesao == 'SACRO' && item.datatermino == null);
    if (x.length > 0) {
      return (
        <div
          className="red-invasion"
          title={'LESÃO SACRAL \nESTÁGIO: ' + x.map(item => item.grau)}
          style={{
            position: 'absolute',
            top: '50%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          }}
          onClick={() => clickLesao('SACRO')}
        >
          {x.map(item => item.grau)}
        </div>
      );
    } else {
      return (
        <div
          className="green-invasion"
          title={'SACRAL'}
          style={{
            position: 'absolute',
            top: '50%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            opacity: 0.5,
          }}
          onClick={() => clickLesao('SACRO')}
        >
        </div>
      );
    }
  }

  function ShowIsquioD() {
    var x = lesoes.filter(item => item.lesao == 'ISQUIO DIREITO' && item.datatermino == null);
    if (x.length > 0) {
      return (
        <div
          className="red-invasion"
          title={'LESÃO ISQUIÁTICA DIREITA \nESTÁGIO: ' + x.map(item => item.grau)}
          style={{
            position: 'absolute',
            top: '55%',
            left: '55%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          }}
          onClick={() => clickLesao('ISQUIO DIREITO')}
        >
          {x.map(item => item.grau)}
        </div>
      );
    } else {
      return (
        <div
          className="green-invasion"
          title={'ISQUIO DIREITO'}
          style={{
            position: 'absolute',
            top: '55%',
            left: '55%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            opacity: 0.5,
          }}
          onClick={() => clickLesao('ISQUIO DIREITO')}
        >
        </div>
      );
    }
  }

  function ShowIsquioE() {
    var x = lesoes.filter(item => item.lesao == 'ISQUIO ESQUERDO' && item.datatermino == null);
    if (x.length > 0) {
      return (
        <div
          className="red-invasion"
          title={'LESÃO ISQUIÁTICA ESQUERDA \nESTÁGIO: ' + x.map(item => item.grau)}
          style={{
            position: 'absolute',
            top: '55%',
            right: '55%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          }}
          onClick={() => clickLesao('ISQUIO ESQUERDO')}
        >
          {x.map(item => item.grau)}
        </div>
      );
    } else {
      return (
        <div
          className="green-invasion"
          title={'ISQUIO ESQUERDO'}
          style={{
            position: 'absolute',
            top: '55%',
            right: '55%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            opacity: 0.5,
          }}
          onClick={() => clickLesao('ISQUIO ESQUERDO')}
        >
        </div>
      );
    }
  }

  function ShowTrocanterD() {
    var x = lesoes.filter(item => item.lesao == 'TROCANTER DIREITO' && item.datatermino == null);
    if (x.length > 0) {
      return (
        <div
          className="red-invasion"
          title={'LESÃO TROCANTÉRICA DIREITA \nESTÁGIO: ' + x.map(item => item.grau)}
          style={{
            position: 'absolute',
            top: '50%',
            left: '65%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          }}
          onClick={() => clickLesao('TROCANTER DIREITO')}
        >
          {x.map(item => item.grau)}
        </div>
      );
    } else {
      return (
        <div
          className="green-invasion"
          title={'TROCANTER DIREITO'}
          style={{
            position: 'absolute',
            top: '50%',
            left: '65%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            opacity: 0.5,
          }}
          onClick={() => clickLesao('TROCANTER DIREITO')}
        >
        </div>
      );
    }
  }

  function ShowTrocanterE() {
    var x = lesoes.filter(item => item.lesao == 'TROCANTER ESQUERDO' && item.datatermino == null);
    if (x.length > 0) {
      return (
        <div
          className="red-invasion"
          title={'LESÃO TROCANTÉRICA ESQUERDA \nESTÁGIO: ' + x.map(item => item.grau)}
          style={{
            position: 'absolute',
            top: '50%',
            right: '65%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          }}
          onClick={() => clickLesao('TROCANTER ESQUERDO')}
        >
          {x.map(item => item.grau)}
        </div>
      );
    } else {
      return (
        <div
          className="green-invasion"
          title={'TROCANTER ESQUERDO'}
          style={{
            position: 'absolute',
            top: '50%',
            right: '65%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            opacity: 0.5,
          }}
          onClick={() => clickLesao('TROCANTER ESQUERDO')}
        >
        </div>
      );
    }
  }

  function ShowJoelhoD() {
    var x = lesoes.filter(item => item.lesao == 'JOELHO DIREITO' && item.datatermino == null);
    if (x.length > 0) {
      return (
        <div
          className="red-invasion"
          title={'LESÃO EM JOELHO DIREITO \nESTÁGIO: ' + x.map(item => item.grau)}
          style={{
            position: 'absolute',
            top: '70%',
            left: '55%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          }}
          onClick={() => clickLesao('JOELHO DIREITO')}
        >
          {x.map(item => item.grau)}
        </div>
      );
    } else {
      return (
        <div
          className="green-invasion"
          title={'JOELHO DIREITO'}
          style={{
            position: 'absolute',
            top: '70%',
            left: '55%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            opacity: 0.5,
          }}
          onClick={() => clickLesao('JOELHO DIREITO')}
        >
        </div>
      );
    }
  }

  function ShowJoelhoE() {
    var x = lesoes.filter(item => item.lesao == 'JOELHO ESQUERDO' && item.datatermino == null);
    if (x.length > 0) {
      return (
        <div
          className="red-invasion"
          title={'LESÃO EM JOELHO ESQUERDO \nESTÁGIO: ' + x.map(item => item.grau)}
          style={{
            position: 'absolute',
            top: '80%',
            right: '55%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
          }}
          onClick={() => clickLesao('JOELHO ESQUERDO')}
        >
          {x.map(item => item.grau)}
        </div>
      );
    } else {
      return (
        <div
          className="green-invasion"
          title={'JOELHO ESQUERDO'}
          style={{
            position: 'absolute',
            top: '70%',
            right: '55%',
            height: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.02 * window.innerWidth : window.innerWidth > 600 ? 0.07 * window.innerWidth : 0.09 * window.innerWidth,
            opacity: 0.5,
          }}
          onClick={() => clickLesao('JOELHO ESQUERDO')}
        >
        </div>
      );
    }
  }

  function ShowMaleoloD() {
    var x = lesoes.filter(item => item.lesao == 'MALEOLO DIREITO' && item.datatermino == null);
    if (x.length > 0) {
      return (
        <div
          className="red-invasion"
          title={'LESÃO EM MALÉOLO DIREITO \nESTÁGIO: ' + x.map(item => item.grau)}
          style={{
            position: 'absolute',
            top: '88%',
            left: '60%',
            height: window.innerWidth > 800 ? 0.015 * window.innerWidth : window.innerWidth > 600 ? 0.04 * window.innerWidth : 0.07 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.015 * window.innerWidth : window.innerWidth > 600 ? 0.04 * window.innerWidth : 0.07 * window.innerWidth,
          }}
          onClick={() => clickLesao('MALEOLO DIREITO')}
        >
          {x.map(item => item.grau)}
        </div>
      );
    } else {
      return (
        <div
          className="green-invasion"
          title={'MALEOLO DIREITO'}
          style={{
            position: 'absolute',
            top: '88%',
            left: '60%',
            height: window.innerWidth > 800 ? 0.015 * window.innerWidth : window.innerWidth > 600 ? 0.04 * window.innerWidth : 0.07 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.015 * window.innerWidth : window.innerWidth > 600 ? 0.04 * window.innerWidth : 0.07 * window.innerWidth,
            opacity: 0.5,
          }}
          onClick={() => clickLesao('MALEOLO DIREITO')}
        >
        </div>
      );
    }
  }

  function ShowMaleoloE() {
    var x = lesoes.filter(item => item.lesao == 'MALEOLO ESQUERDO' && item.datatermino == null);
    if (x.length > 0) {
      return (
        <div
          className="red-invasion"
          title={'LESÃO EM MALÉOLO ESQUERDO \nESTÁGIO: ' + x.map(item => item.grau)}
          style={{
            position: 'absolute',
            top: '88%',
            right: '60%',
            height: window.innerWidth > 800 ? 0.015 * window.innerWidth : window.innerWidth > 600 ? 0.04 * window.innerWidth : 0.07 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.015 * window.innerWidth : window.innerWidth > 600 ? 0.04 * window.innerWidth : 0.07 * window.innerWidth,
          }}
          onClick={() => clickLesao('MALEOLO ESQUERDO')}
        >
          {x.map(item => item.grau)}
        </div>
      );
    } else {
      return (
        <div
          className="green-invasion"
          title={'MALEOLO ESQUERDO'}
          style={{
            position: 'absolute',
            top: '88%',
            right: '60%',
            height: window.innerWidth > 800 ? 0.015 * window.innerWidth : window.innerWidth > 600 ? 0.04 * window.innerWidth : 0.07 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.015 * window.innerWidth : window.innerWidth > 600 ? 0.04 * window.innerWidth : 0.07 * window.innerWidth,
            opacity: 0.5,
          }}
          onClick={() => clickLesao('MALEOLO ESQUERDO')}
        >
        </div>
      );
    }
  }

  function ShowHaluxD() {
    var x = lesoes.filter(item => item.lesao == 'HALUX DIREITO' && item.datatermino == null);
    if (x.length > 0) {
      return (
        <div
          className="red-invasion"
          title={'LESÃO EM HÁLUX DIREITO \nESTÁGIO: ' + x.map(item => item.grau)}
          style={{
            position: 'absolute',
            top: '95%',
            left: '50%',
            height: window.innerWidth > 800 ? 0.01 * window.innerWidth : window.innerWidth > 600 ? 0.035 * window.innerWidth : 0.045 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.01 * window.innerWidth : window.innerWidth > 600 ? 0.035 * window.innerWidth : 0.045 * window.innerWidth,
          }}
          onClick={() => clickLesao('HALUX DIREITO')}
        >
          {x.map(item => item.grau)}
        </div>
      );
    } else {
      return (
        <div
          className="green-invasion"
          title={'HÁLUX DIREITO'}
          style={{
            position: 'absolute',
            top: '95%',
            left: '50%',
            height: window.innerWidth > 800 ? 0.01 * window.innerWidth : window.innerWidth > 600 ? 0.035 * window.innerWidth : 0.045 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.01 * window.innerWidth : window.innerWidth > 600 ? 0.035 * window.innerWidth : 0.045 * window.innerWidth,
            opacity: 0.5,
          }}
          onClick={() => clickLesao('HALUX DIREITO')}
        >
        </div>
      );
    }
  }

  function ShowHaluxE() {
    var x = lesoes.filter(item => item.lesao == 'HALUX ESQUERDO' && item.datatermino == null);
    if (x.length > 0) {
      return (
        <div
          className="red-invasion"
          title={'LESÃO EM HÁLUX ESQUERDO \nESTÁGIO: ' + x.map(item => item.grau)}
          style={{
            position: 'absolute',
            top: '95%',
            right: '55%',
            height: window.innerWidth > 800 ? 0.01 * window.innerWidth : window.innerWidth > 600 ? 0.035 * window.innerWidth : 0.045 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.01 * window.innerWidth : window.innerWidth > 600 ? 0.035 * window.innerWidth : 0.045 * window.innerWidth,
          }}
          onClick={() => clickLesao('HALUX ESQUERDO')}
        >
          {x.map(item => item.grau)}
        </div>
      );
    } else {
      return (
        <div
          className="green-invasion"
          title={'HÁLUX ESQUERDO'}
          style={{
            position: 'absolute',
            top: '95%',
            right: '50%',
            height: window.innerWidth > 800 ? 0.01 * window.innerWidth : window.innerWidth > 600 ? 0.035 * window.innerWidth : 0.045 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.01 * window.innerWidth : window.innerWidth > 600 ? 0.035 * window.innerWidth : 0.045 * window.innerWidth,
            opacity: 0.5,
          }}
          onClick={() => clickLesao('HALUX ESQUERDO')}
        >
        </div>
      );
    }
  }

  function ShowCalcaneoD() {
    var x = lesoes.filter(item => item.lesao == 'CALCANEO DIREITO' && item.datatermino == null);
    if (x.length > 0) {
      return (
        <div
          className="red-invasion"
          title={'LESÃO EM CALCÂNEO DIREITO \nESTÁGIO: ' + x.map(item => item.grau)}
          style={{
            position: 'absolute',
            top: '91%',
            left: '52%',
            height: window.innerWidth > 800 ? 0.015 * window.innerWidth : window.innerWidth > 600 ? 0.05 * window.innerWidth : 0.07 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.015 * window.innerWidth : window.innerWidth > 600 ? 0.05 * window.innerWidth : 0.07 * window.innerWidth,
          }}
          onClick={() => clickLesao('CALCANEO DIREITO')}
        >
          {x.map(item => item.grau)}
        </div>
      );
    } else {
      return (
        <div
          className="green-invasion"
          title={'CALCÂNEO DIREITO'}
          style={{
            position: 'absolute',
            top: '91%',
            left: '52%',
            height: window.innerWidth > 800 ? 0.015 * window.innerWidth : window.innerWidth > 600 ? 0.05 * window.innerWidth : 0.07 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.015 * window.innerWidth : window.innerWidth > 600 ? 0.05 * window.innerWidth : 0.07 * window.innerWidth,
            opacity: 0.5,
          }}
          onClick={() => clickLesao('CALCANEO DIREITO')}
        >
        </div>
      );
    }
  }

  function ShowCalcaneoE() {
    var x = lesoes.filter(item => item.lesao == 'CALCANEO ESQUERDO' && item.datatermino == null);
    if (x.length > 0) {
      return (
        <div
          className="red-invasion"
          title={'LESÃO EM CALCÂNEO ESQUERDO \nESTÁGIO: ' + x.map(item => item.grau)}
          style={{
            position: 'absolute',
            top: '91%',
            right: '52%',
            height: window.innerWidth > 800 ? 0.015 * window.innerWidth : window.innerWidth > 600 ? 0.05 * window.innerWidth : 0.07 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.015 * window.innerWidth : window.innerWidth > 600 ? 0.05 * window.innerWidth : 0.07 * window.innerWidth,
          }}
          onClick={() => clickLesao('CALCANEO ESQUERDO')}
        >
          {x.map(item => item.grau)}
        </div>
      );
    } else {
      return (
        <div
          className="green-invasion"
          title={'CALCÂNEO ESQUERDO'}
          style={{
            position: 'absolute',
            top: '91%',
            right: '52%',
            height: window.innerWidth > 800 ? 0.015 * window.innerWidth : window.innerWidth > 600 ? 0.05 * window.innerWidth : 0.07 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.015 * window.innerWidth : window.innerWidth > 600 ? 0.05 * window.innerWidth : 0.07 * window.innerWidth,
            opacity: 0.5,
          }}
          onClick={() => clickLesao('CALCANEO ESQUERDO')}
        >
        </div>
      );
    }
  }

  function ShowOrelhaD() {
    var x = lesoes.filter(item => item.lesao == 'ORELHA DIREITA' && item.datatermino == null);
    if (x.length > 0) {
      return (
        <div
          className="red-invasion"
          title={'LESÃO EM ORELHA ESQUERDA \nESTÁGIO: ' + x.map(item => item.grau)}
          style={{
            position: 'absolute',
            top: '8%',
            left: '55%',
            height: window.innerWidth > 800 ? 0.015 * window.innerWidth : window.innerWidth > 600 ? 0.05 * window.innerWidth : 0.07 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.015 * window.innerWidth : window.innerWidth > 600 ? 0.05 * window.innerWidth : 0.07 * window.innerWidth,
          }}
          onClick={() => clickLesao('ORELHA DIREITA')}
        >
          {x.map(item => item.grau)}
        </div>
      );
    } else {
      return (
        <div
          className="green-invasion"
          title={'ORELHA DIREITA'}
          style={{
            position: 'absolute',
            top: '8%',
            left: '55%',
            height: window.innerWidth > 800 ? 0.015 * window.innerWidth : window.innerWidth > 600 ? 0.05 * window.innerWidth : 0.07 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.015 * window.innerWidth : window.innerWidth > 600 ? 0.05 * window.innerWidth : 0.07 * window.innerWidth,
            opacity: 0.5,
          }}
          onClick={() => clickLesao('ORELHA DIREITA')}
        >
        </div>
      );
    }
  }

  function ShowOrelhaE() {
    var x = lesoes.filter(item => item.lesao == 'ORELHA ESQUERDA' && item.datatermino == null);
    if (x.length > 0) {
      return (
        <div
          className="red-invasion"
          title={'LESÃO EM ORELHA ESQUERDA \nESTÁGIO: ' + x.map(item => item.grau)}
          style={{
            position: 'absolute',
            top: '8%',
            right: '55%',
            height: window.innerWidth > 800 ? 0.015 * window.innerWidth : window.innerWidth > 600 ? 0.05 * window.innerWidth : 0.07 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.015 * window.innerWidth : window.innerWidth > 600 ? 0.05 * window.innerWidth : 0.07 * window.innerWidth,
          }}
          onClick={() => clickLesao('ORELHA ESQUERDA')}
        >
          {x.map(item => item.grau)}
        </div>
      );
    } else {
      return (
        <div
          className="green-invasion"
          title={'ORELHA ESQUERDA'}
          style={{
            position: 'absolute',
            top: '8%',
            right: '55%',
            height: window.innerWidth > 800 ? 0.015 * window.innerWidth : window.innerWidth > 600 ? 0.05 * window.innerWidth : 0.07 * window.innerWidth,
            width: window.innerWidth > 800 ? 0.015 * window.innerWidth : window.innerWidth > 600 ? 0.05 * window.innerWidth : 0.07 * window.innerWidth,
            opacity: 0.5,
          }}
          onClick={() => clickLesao('ORELHA ESQUERDA')}
        >
        </div>
      );
    }
  }

  const showSideBar = (e) => {
    if (e.pageX < 20) {
      document.getElementById("sidebar").className = "pacientes-menu-in";
    }
  }
  // selecionando um paciente da lista e atualizando a tela corrida.
  const [cd_atendimento, setcd_atendimento] = useState();
  const selectPaciente = (item) => {
    setidpaciente(item.cd_paciente);
    setidatendimento(item.cd_atendimento);
    setconvenio(item.nm_convenio);
    setdatainternacao(item.dt_hr_atendimento);

    // setloadprincipal(1);
    //setTimeout(() => {
    //setloadprincipal(0);
    //}, 3000);
  };
  // SIDEBAR ANIMADA COM LISTA DE PACIENTES.
  function SideBar() {
    return (
      <div
        id="sidebar"
        className="pacientes-menu-out"
        onMouseOver={() => document.getElementById("sidebar").className = "pacientes-menu-in"}
        onMouseOut={() => document.getElementById("sidebar").className = "pacientes-menu-out"}
        style={{
          display: tipounidade != 4 && window.innerWidth > 800 ? 'flex' : 'none',
          width: '30vw',
          position: 'absolute',
          padding: 10, paddingLeft: 0,
          zIndex: 50,
        }
        }>
        <div
          className="widget"
          style={{
            flexDirection: 'column', justifyContent: 'center', margin: 0,
            borderRadius: 5, borderTopLeftRadius: 0, borderBottomLeftRadius: 0,
            width: '100%',
            height: '100%',
            padding: 10, paddingLeft: 0,
            boxShadow: '0px 2px 10px 5px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div className="title2" style={{ color: "#ffffff" }}>{'LISTA DE PACIENTES:  ' + nomeunidade}</div>
          <div className="scroll"
            style={{
              backgroundColor: 'white',
              height: '80vh', width: '100%',
              justifyContent: 'flex-start', borderTopLeftRadius: 0, borderBottomLeftRadius: 0, paddingLeft: 7.5
            }}>
            {todosatendimentos.filter(item => item.Leito.unidade.id == idunidade).sort(((a, b) => a.Leito.descricao > b.Leito.descricao ? 1 : -1)).map(item => (
              <div
                key={item.id}
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
              >
                <button className="grey-button"
                  style={{ backgroundColor: 'grey', minWidth: 80, width: 80, marginRight: 10, display: item.box !== '' ? 'flex' : 'none' }}>
                  {item.Leito.descricao}
                </button>
                <button
                  onClick={() => selectPaciente(item)}
                  className='blue-button'
                  title={
                    'STATUS: ' +
                    item.status +
                    '. CLIQUE PARA EVOLUIR.'
                  }
                  style={{
                    padding: 10,
                    margin: 2.5,
                    width: '100%',
                    height: 50,
                  }}
                >
                  {item.nm_paciente}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div >
    )
  }

  /*
  var p1 = new Promise(function (resolve, reject) {
    if (viewdeletetoast == 1) {
      resolve('SUCESSO');
    } else {
      reject('ERRO');
    }
  });
   
  p1.then((message) => {
    console.log(message);
  });
  */
  // confirmação de exclusão de um registro otimizada...
  // função para construção dos deletetoasts.

  // const [viewdeletetoast, setviewdeletetoast] = useState(0);
  var timeout = null;
  var deletekey = 0;
  const deletetoast = (funcao, item) => {
    document.getElementById("deletekey 1 " + item.id).style.display = "flex"
    document.getElementById("deletekey 0 " + item.id).style.display = "none"
    if (deletekey == 0) {
      deletekey = 1;
      document.getElementById("deletekey 1 " + item.id).style.display = "flex"
      document.getElementById("deletekey 0 " + item.id).style.display = "none"
    } else {
      deletekey = 0;
      document.getElementById("deletekey 0 " + item.id).style.display = "flex"
      document.getElementById("deletekey 1 " + item.id).style.display = "none"
    }
    clearTimeout(timeout);
    console.log('VIEW: ' + deletekey)
    timeout = setTimeout(() => {
      if (deletekey == 1) {
        funcao(item);
        console.log('REGISTRO EXCLUÍDO.');
      } else {
        console.log('REGISTRO MANTIDO.');
      }
      if (document.getElementById("deletekey 1 " + item.id) != null) {
        document.getElementById("deletekey 0 " + item.id).style.display = "flex"
        document.getElementById("deletekey 1 " + item.id).style.display = "none"
      }
    }, 3000);
  }

  // RENDERIZAÇÃO DO COMPONENTE PRONTUÁRIO.
  return (
    <div
      className="main fade-in"
      id="PRINCIPAL"
      onMouseMove={(e) => { showSideBar(e) }}
    >
      <LoadPrincipal></LoadPrincipal>
      <ViewMockRx></ViewMockRx>
      <div
        style={{
          display: window.innerWidth < 800 && loadprincipal == 0 ? 'flex' : 'none',
          position: 'fixed', bottom: 10, left: 10, zIndex: 1,
        }}
      >
        <ButtonMobileMenu></ButtonMobileMenu>
      </div>
      <MobileMenu></MobileMenu>
      <Evolucao
        // variáveis da corrida.
        hospital={nomehospital}
        unidade={nomeunidade}
        // variáveis da evolução.
        viewevolucao={viewevolucao}
        idevolucao={idevolucao ? idevolucao : 0}
        data={dataevolucao}
        idpaciente={idpaciente}
        idatendimento={idatendimento}
        idusuario={idusuario}
        usuario={nomeusuario}
        funcao={tipousuario}
        idusuariologado={idusuario}
        evolucao={evolucao}
        pas={pas}
        pad={pad}
        fc={fc}
        fr={fr}
        sao2={sao2}
        tax={tax}
        diu={diu}
        fezes={fezes}
        bh={bh}
        acv={acv}
        ar={ar}
        abdome={abdome}
        outros={outros}
        glasgow={glasgow}
        rass={rass}
        ramsay={ramsay}
        hd={hd}
        uf={uf}
        heparina={heparina}
        braden={braden}
        morse={morse}
      />
      <PrintEvolucao
        // variáveis da corrida.
        hospital={nomehospital}
        unidade={nomeunidade}
        // variáveis da evolução.
        viewprintevolucao={viewprintevolucao}
        idevolucao={idevolucao ? idevolucao : 0}
        data={dataevolucao}
        idatendimento={idatendimento}
        idusuario={idusuario}
        usuario={nomeusuario}
        funcao={tipousuario}
        conselho={conselhousuario}
        idusuariologado={idusuario}
        box={box}
        nome={nomepaciente}
        dn={dn}
        evolucao={evolucao}
        pas={pas}
        pad={pad}
        fc={fc}
        fr={fr}
        sao2={sao2}
        tax={tax}
        diu={diu}
        fezes={fezes}
        bh={bh}
        acv={acv}
        ar={ar}
        abdome={abdome}
        outros={outros}
        glasgow={glasgow}
        rass={rass}
        ramsay={ramsay}
        hd={hd}
        uf={uf}
        heparina={heparina}
        braden={braden}
        morse={morse}
      />
      <Formularios
        // variáveis da corrida.
        hospital={nomehospital}
        unidade={nomeunidade}
        // variáveis do formulário.
        viewformulario={viewformulario}
        idpaciente={idpaciente}
        idatendimento={idatendimento}
        idusuario={idusuario}
        usuario={nomeusuario}
        funcao={tipousuario}
        conselho={especialidadeusuario}
        box={box}
        nome={nomepaciente}
        dn={dn}
        idformulario={idformulario}
        dataformulario={dataformulario}
        tipoformulario={tipoformulario}
        textoformulario={textoformulario}
        statusformulario={statusformulario}
      />
      <PrintFormulario
        // variáveis da corrida.
        hospital={nomehospital}
        unidade={nomeunidade}
        // variáveis do formulário.
        viewprintformulario={viewprintformulario}
        idatendimento={idatendimento}
        idusuario={idusuario}
        usuario={nomeusuario}
        funcao={tipousuario}
        conselho={especialidadeusuario}
        box={box}
        nome={nomepaciente}
        dn={dn}
        idformulario={idformulario}
        dataformulario={dataformulario}
        tipoformulario={tipoformulario}
        textoformulario={textoformulario}
        statusformulario={statusformulario}
      />
      <Diagnostico
        // variáveis da corrida.
        usuario={nomeusuario}
        // variáveis dos diagnósticos.
        viewdiagnostico={viewdiagnostico}
        inicio={iniciodiag}
        termino={terminodiag}
        cid={cid}
        iddiagnostico={iddiagnostico}
        diagnostico={diagnostico}
        iniciodiag={iniciodiag}
        terminodiag={terminodiag}
      />
      <Problemas
        viewproblema={viewproblema}
        inicio={inicioproblema}
        idproblema={idproblema}
        problema={problema}
      />
      <Propostas
        // variáveis das propostas.
        viewproposta={viewproposta}
        idproposta={idproposta}
        proposta={proposta}
        inicio={inicioprop}
        termino={terminoprop}
      />
      <Interconsultas
        // variáveis da corrida.
        hospital={nomehospital}
        unidade={nomeunidade}
        idusuario={idusuario}
        usuario={nomeusuario}
        tipo={tipousuario}
        // variáveis das interconsultas.
        viewinterconsulta={viewinterconsulta}
        idpaciente={idpaciente}
        idatendimento={idatendimento}
        idinterconsulta={idinterconsulta}
        especialidade={especialidadeinterconsulta}
        motivo={motivointerconsulta}
        parecer={parecerinterconsulta}
        datainicio={datainiciointerconsulta}
        datatermino={dataterminointerconsulta}
        idsolicitante={idsolicitanteinterconsulta}
        idatendente={idatendenteinterconsulta}
        status={statusinterconsulta}
      />
      <Laboratorio
        // variáveis da corrida.
        hospital={nomehospital}
        unidade={nomeunidade}
        idusuario={idusuario}
        usuario={nomeusuario}
        funcao={tipousuario}
        // variáveis do laboratório.
        viewlaboratorio={viewlaboratorio}
        idatendimento={idatendimento}
      />
      <Imagem
        // variáveis da corrida.
        hospital={nomehospital}
        unidade={nomeunidade}
        idusuario={idusuario}
        usuario={nomeusuario}
        funcao={tipousuario}
        // variáveis das imagens.
        viewimagem={viewimagem}
        idatendimento={idatendimento}
      />
      <Balanco
        // variáveis da corrida.
        hospital={nomehospital}
        unidade={nomeunidade}
        idusuario={idusuario}
        usuario={nomeusuario}
        funcao={tipousuario}
        // variáveis do balanço.
        viewbalanco={viewbalanco}
        idatendimento={idatendimento}
        idbalanco={idbalanco}
        databalanco={moment().format('DD/MM/YYYY')}
        horabalanco={moment().format('HH') + ':00'}
        pas={pas}
        pad={pad}
        fc={fc}
        fr={fr}
        sao2={sao2}
        tax={tax}
        diu={diu}
        fezes={fezes}
      />
      <div id="POPUPS">
        <Toast valortoast={valortoast} cor={cor} mensagem={mensagem} tempo={tempo} />
        <DatePicker valordatepicker={valordatepicker} mododatepicker={mododatepicker} />
        <ShowInvasaoMenu></ShowInvasaoMenu>
        <ShowInfoLesoes></ShowInfoLesoes>
        <ShowCurativosList></ShowCurativosList>
        <ChangeStatus></ChangeStatus>
        <ChangeCabeceira></ChangeCabeceira>
        <ChangeDieta></ChangeDieta>
        <Braden></Braden>
        <Morse></Morse>
        <UpdateVm></UpdateVm>
      </div>
      <div id="ESCALAS">
        <AptEscalaPPS viewescalapps={viewescalapps}></AptEscalaPPS>
        <AptEscalaMIF viewescalamif={viewescalamif}></AptEscalaMIF>
        <AptEscalaIVCF viewescalaivcf={viewescalaivcf}></AptEscalaIVCF>
      </div>
      <div id="PRONTUÁRIO"
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          height: window.innerHeight,
          width: window.innerWidth,
        }}>
        <div id="LISTAS"
          className="prontuario"
          style={{
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center',
            height: window.innerHeight,
            padding: 0,
            margin: 0,
          }}>
          <Paciente></Paciente>
          <HistoricoDeAtendimentos></HistoricoDeAtendimentos>
          <Principal></Principal>
          <ShowPlanoTerapeutico></ShowPlanoTerapeutico>
          <ShowEvolucoes></ShowEvolucoes>
          <ShowEscalas></ShowEscalas>
          <EscalasAssistenciais></EscalasAssistenciais>
          <ShowDiagnosticos></ShowDiagnosticos>
          <ShowProblemas></ShowProblemas>
          <ShowPropostas></ShowPropostas>
          <ShowIntercosultas></ShowIntercosultas>
          <ShowLaboratorio></ShowLaboratorio>
          <ShowImagem></ShowImagem>
          <Prescricao newprescricao={newprescricao}></Prescricao>
          <ShowFormularios></ShowFormularios>
          <ShowBalancos></ShowBalancos>
        </div>
        <Menu></Menu>
        <SideBar></SideBar>
        <UpdateAtendimento viewupdateatendimento={viewupdateatendimento}></UpdateAtendimento>
        <Settings></Settings>
        <GetSpeech></GetSpeech>
        <ShowSpeech></ShowSpeech>
      </div>
    </div>
  );
}

export default Prontuario;