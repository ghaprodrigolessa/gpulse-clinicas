/* eslint eqeqeq: "off" */
import React, { useState, useContext } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { Doughnut, Line, Bar } from 'react-chartjs-2'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import salvar from '../images/salvar.svg'
import lupa from '../images/lupa.svg'
import deletar from '../images/deletar.svg'
import Toast from '../components/Toast'
import Header from '../components/Header'
import moment from 'moment'
import Context from '../Context'
import { useHistory } from 'react-router-dom'
import useInterval from 'react-useinterval'

// lixo a excluir (insistĂȘncia de Guilherme).
import { Stuff } from '../components/Stuff'
import Atendimentos from './Atendimentos'

function Unidades() {
  var htmlrodrigo = 'https://pulsarapp-server.herokuapp.com';
  //var htmlunidades = 'http://45.178.182.201:8080/api/v1/unidades/get_todas_unidades';
  //var htmlleitos = 'http://45.178.182.201:8080/api/v1/leitos/get_todos_leitos';
  //var htmlatendimentos = 'http://45.178.182.201:8080/api/v1/atendimentos/lista_atendimentos_internados';
  var htmlrodrigoteste = process.env.REACT_APP_API_RODRIGO;
  var htmlunidades = process.env.REACT_APP_API_UNIDADES;
  // var htmlsetores = process.env.REACT_APP_API_SETORES;
  var htmlsetores = process.env.REACT_APP_API_SETORES;
  var htmlleitos = process.env.REACT_APP_API_LEITOS;
  var htmlatendimentos = process.env.REACT_APP_API_ATENDIMENTOS;
  // recuperando estados globais (Context.API).
  const {
    idusuario,
    nomeusuario,
    tipousuario,
    setidunidade,
    idunidade,
    settipounidade,
    setnomeunidade,
    nomeunidade,
    especialidadeusuario,
    idhospital,
    nomehospital,
    setidatendimento, idatendimento,
    settodosleitos,
    todosleitos,
    settodosatendimentos,
    todosatendimentos,
    listinterconsultas, setlistinterconsultas,
    setidpaciente, idpaciente, setdatainternacao, datainternacao, setconvenio, convenio, setdadospaciente,
  } = useContext(Context)
  // history (react-router-dom).
  let history = useHistory()

  // carregamento da lista de unidades de atendimento do hospital, nas quais o usuĂĄrio trabalha.
  const [unidades, setunidades] = useState([])
  const [arrayunidades, setarrayunidades] = useState([])
  const loadUnidades = () => {
    // alert(console.log(htmlrodrigo));
    axios
      .get(htmlunidades)
      .then((response) => {
        var x = response.data;
        setunidades(response.data)
        setarrayunidades(response.data)
        // alert(x.map(item => item.id));
      })
  }

  // carregando interconsultas para exibiĂ§ĂŁo dos grĂĄficos das unidades.
  var htmlghapinterconsultasall = process.env.REACT_APP_API_CLONE_INTERCONSULTASALL;
  const [listinterconsultasall, setlistinterconsultasall] = useState([]);
  const loadInterconsultas = () => {
    axios.get(htmlghapinterconsultasall).then((response) => {
      var x = [0, 1];
      var y = [0, 1];
      x = response.data;
      y = x.rows
      setlistinterconsultasall(y.filter(item => item.especialidade == especialidadeusuario));
      // alert(listinterconsultasall.length)
    });
  }

  // carregando da lista de cirurgias no bloco cirĂșrgico.
  const [agendabloco, setagendabloco] = useState([])
  const loadAgendaBloco = () => {
    axios.get(htmlrodrigo + '/agendabloco').then((response) => {
      var x = [0, 1]
      x = response.dataF
      // filtrando as cirurgias agendadas para a data atual.
      setagendabloco(
        x.filter(
          (item) =>
            item.hospital == nomehospital &&
            moment(
              JSON.stringify(item.datainicio).substring(1, 9),
              'DD/MM/YY',
            ) == moment().startOf('day'),
        ),
      )
    })
  }

  // carregando regitro de atendimentos.
  var htmlatendimentos = process.env.REACT_APP_API_ATENDIMENTOS;
  const loadAtendimentos = () => {
    // captura registros de atendimentos.
    axios.get(htmlatendimentos).then((response) => {
      var x = [0, 1]
      x = response.data;
      settodosatendimentos(x);
    });
  }

  // captura registros de atendimentos.
  const loadAtendimentosInicial = () => {
    axios.get(htmlatendimentos).then((response) => {
      var x = [0, 1]
      x = response.data;
      settodosatendimentos(x);
    })
  }

  // atualizando resgistro de atendimentos.
  useInterval(() => {
    console.log('ATUALIZANDO ATENDIMENTOS EM UNIDADES');
    loadAtendimentosInicial();
    setTimeout(() => {
      // setstateinterconsultas(arrayinterconsultas);
      // alert(stateinterconsultas.length)
    }, 2000);
  }, 60000);

  // TIPOS DE UNIDADES: 1 = pronto-socorro; 2 = demais unidades de internaĂ§ĂŁo (CTIs, enfermarias); 3 = bloco cirĂșrgico; 4 = ambulatĂłrios.
  // montando a lista de unidades.
  function ShowUnidades() {
    return (
      <div
        className="scroll"
        id="LISTA DE UNIDADES"
        style={{
          scrollBehavior: 'smooth',
          height: '82vh', maxHeight: '82vh',
          flexDirection: window.innerWidth < 400 ? 'column' : 'row',
          flexWrap: window.innerWidth < 400 ? 'nowrap' : 'wrap',
          backgroundColor: 'transparent', borderColor: 'transparent'
        }}
      >
        <TodosPacientes></TodosPacientes>
        {arrayunidades.filter(item => item.setor.empresa.id == idhospital).map((item) => GetData(item))}
      </div>
    )
  }

  // selecionando uma unidade da lista.
  const selectUnidade = (item) => {
    setnomeunidade(item.descricao)
    setidunidade(item.id);
    /*
    if (item.setor_tipo_id == null) { // alterar quando funcionar!
      // farmĂĄcia.
      history.push('/farmacia')
    } else if (item.setor_tipo_id == null) { // alterar quando funcionar!
      history.push('/ambulatorio')
    } else {
      history.push('/pacientes')
    }
    */
    history.push('/pacientes')
  }

  // selecionando unidade de bloco cirĂșrgico.
  const selectBlocoCirurgico = (item) => {
    history.push('/bloco')
  }

  // selecionando unidade de bloco cirĂșrgico.
  const selectAmbulatorio = (item) => {
    setnomeunidade(item.unidade)
    history.push('/ambulatorio')
  }

  useEffect(() => {
    // alert('ATENDIMENTOS: ' + todosatendimentos.map(item => item.Leito.descricao));
    // carregando a lista de unidades.
    loadUnidades();
    // carregando a lista de atendimentos.
    loadAtendimentosInicial();
    setTimeout(() => {
      // setstateinterconsultas(arrayinterconsultas);
      // alert(stateinterconsultas.map(item => item.datainicio));
    }, 2000);
    // carregando a lista de interconsultas.
    loadInterconsultas();
    // carregando a lista de cirurgias.
    // loadAgendaBloco();
    // carregando a lista de consultas ambulatoriais.
    loadAmbulatorio();
    // preparando os grĂĄficos das unidades.
    mountDataChart();
    // atraso para renderizaĂ§ĂŁo dos cards com os grĂĄficos (evita o glitch das animaĂ§Ă”es dos doughnuts).
    setTimeout(() => {
      setrenderchart(1);
    }, 1000);
    // eslint-disable-next-line
  }, [])

  const selectEscala = (item) => {
    history.push('/escala')
  }

  // abrindo a lista de interconsultas.
  function showInterconsultas(item, e) {
    setnomeunidade(item.descricao)
    setidunidade(item.id);
    setviewinterconsultas(1);
    e.stopPropagation();
  }

  // botĂŁo para acesso a solicitaĂ§ĂŁo de INTERCONSULTAS, para a especialidade do usuĂĄrio.
  function BtnInterconsultas(item) {
    return (
      <button
        className="yellow-button"
        onClick={() => {setviewinterconsultas(1); setidunidade(item.id)}}
        title={
          'INTERCONSULTAS PENDENTES OU PACIENTES EM \n ACOMPANHAMENTO PELA ' +
          especialidadeusuario +
          '.'
        }
        style={{
          position: 'absolute',
          bottom: -5,
          right: -10,
          borderStyle: 'solid',
          borderWidth: 5,
          borderColor: '#ffffff',
          borderRadius: 50,
          width: 50,
          height: 50,
          margin: 0,
          padding: 5,
          opacity: 1,
          boxShadow: 'none',
          display:
            listinterconsultasall.filter(valor => valor.unidade == item.id).length > 0 ? 'flex' : 'none'
        }}
        onClick={(e) => showInterconsultas(item, e)}
      >
        {listinterconsultasall.filter(valor => valor.unidade == item.id).length}
      </button>
    )
  }

  // lista de pacientes.
  const [listpacientes, setlistpacientes] = useState([])
  const loadPacientes = () => {
    axios.get(htmlrodrigo + '/pacientes').then((response) => {
      var x = [0, 1]
      x = response.data
      setlistpacientes(x)
    })
  }

  // lista de consultas ambulatoriais.
  const [ambulatorio, setambulatorio] = useState([])
  const loadAmbulatorio = () => {
    // todos os pacientes agendados para o mĂ©dico logado.
    axios.get(htmlrodrigo + '/atendimentos').then((response) => {
      setambulatorio(response.data)
    })
  }

  var newparecer = ''
  const updateParecer = (value) => {
    newparecer = value
  }

  // atualizando ou suspendendo uma interconsulta.
  var htmlghapupdateinterconsulta = process.env.REACT_APP_API_CLONE_UPDATEINTERCONSULTA;
  const updateInterconsulta = (item, valor) => {
    var obj = {
      idpct: item.idpct,
      idatendimento: item.idatendimento,
      especialidade: item.especialidade,
      motivo: item.motivo,
      parecer: valor == 2 ? document.getElementById("inputParecer").value : item.parecer,
      datainicio: moment(),
      datatermino: valor == 3 ? moment() : null,
      idsolicitante: item.idsolicitante,
      idatendente: item.idatendente,
      status: valor, // 0 = registrada, 1 = assinada, 2 = respondida, 3 = alta.
    };
    axios.post(htmlghapupdateinterconsulta + item.id, obj).then(() => {
      toast(1, '#52be80', 'INTERCONSULTA ASSINADA COM SUCESSO.', 3000);
      loadInterconsultas();
    });
  }

  // acessando o prontuĂĄrio do paciente com interconsulta.
  var htmlpacientes = process.env.REACT_APP_API_FILTRAPACIENTES;
  const gotoProntuario = (item) => {
    // var x = todosatendimentos.filter(value => value.cd_atendimento == item.idatendimento);
    setidpaciente(todosatendimentos.filter(value => value.cd_atendimento == item.idatendimento).map(item => item.cd_paciente));
    setidatendimento(todosatendimentos.filter(value => value.cd_atendimento == item.idatendimento).map(item => item.cd_atendimento));
    setdatainternacao(todosatendimentos.filter(value => value.cd_atendimento == item.idatendimento).map(item => item.dt_hr_atendimento));
    setconvenio(todosatendimentos.filter(value => value.cd_atendimento == item.idatendimento).map(item => item.nm_convenio));
    setdadospaciente(todosatendimentos.filter(value => value.cd_atendimento == item.idatendimento));
    // setviewinterconsultas(0);
    // alert(todosatendimentos.filter(value => value.cd_atendimento == item.idatendimento).map(item => item.cd_paciente));
    history.push('/prontuario');
  }

  // memorizando a posiĂ§ĂŁo da scroll nas listas.
  var scrollpos = 0
  const [scrollposition, setscrollposition] = useState(0)
  var timeout
  const scrollPosition = (value) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      scrollpos = document.getElementById(value).scrollTop
      setscrollposition(document.getElementById(value).scrollTop)
      document.getElementById(value).scrollTop = scrollpos
    }, 500)
  }

  // guardando a posiĂ§ĂŁo da scroll.
  const keepScroll = (value) => {
    setTimeout(() => {
      document.getElementById(value).scrollTop = scrollposition
    }, 300)
  }

  // exibindo a tela de interconsultas.
  const [viewinterconsultas, setviewinterconsultas] = useState(0)
  function ViewInterconsultas() {
    if (viewinterconsultas === 1) {
      return (
        <div
          className="menucover"
          onClick={(e) => { setviewinterconsultas(0); e.stopPropagation() }}
          style={{
            zIndex: 9, display: 'flex', flexDirection: 'column',
            justifyContent: 'center', alignItems: 'center'
          }}>
          <div className="menucontainer">
            <div id="cabeĂ§alho" className="cabecalho">
              <div>{'INTERCONSULTAS: ' + especialidadeusuario + ' - ' + nomeunidade}</div>
              <div id="botĂ”es" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <button className="red-button" onClick={() => setviewinterconsultas(0)}>
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
              <div
                className="scroll"
                id="LISTA DE INTERCONSULTAS"
                onScroll={() => scrollPosition('LISTA DE INTERCONSULTAS')}
                onLoad={() => keepScroll('LISTA DE INTERCONSULTAS')}
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  margin: 5,
                  padding: 2.5,
                  height: 0.7 * window.innerHeight,
                  // width: 0.8 * window.innerWidth,
                }}
              >
                {listinterconsultasall.filter(value => value.especialidade == especialidadeusuario && value.unidade == idunidade).map((item) => (
                  <div
                    key={item.id}
                    id="item da lista"
                    className="row"
                    style={{
                      margin: 2.5,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      paddingRight: 10,
                      width: 0.7 * window.innerWidth,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection:
                          window.innerWidth < 800 ? 'column' : 'row',
                        justifyContent: 'center',
                        padding: 0,
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'center',
                          width: '100%',
                          margin: 2.5,
                          marginBottom: 0,
                        }}
                      >
                        <button
                          className="blue-button"
                          style={{
                            width:
                              window.innerWidth < 800
                                ? 0.15 * window.innerWidth
                                : 100,
                            maxWidth:
                              window.innerWidth < 800
                                ? 0.15 * window.innerWidth
                                : 100,
                            minWidth:
                              window.innerWidth < 800
                                ? 0.15 * window.innerWidth
                                : 100,
                            margin: 2.5,
                            marginLeft: 0,
                            padding: 5,
                            flexDirection: 'column',
                          }}
                        >
                          {moment(item.datainicio).format('DD/MM/YY')}
                        </button>
                        <button
                          className="grey-button"
                          style={{
                            width: 100,
                            maxWidth: 100,
                            minWidth: 100,
                            height: 50,
                            maxHeight: 50,
                            minHeight: 50,
                            margin: 2.5,
                            padding: 5,
                            flexDirection: 'column',
                          }}
                        >
                          {
                            todosatendimentos
                              .filter(
                                (value) => value.cd_atendimento == item.idatendimento,
                              )
                              .map((value) => value.Leito.descricao)
                          }
                        </button>
                        <div
                          className="text2"
                          style={{
                            verticalAlign: 'center',
                            width: '100%',
                            margin: 2.5,
                            padding: 5,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            height: 50,
                            fontWeight: 'bold'
                          }}
                        >
                          {todosatendimentos.filter((value) => value.cd_atendimento == item.idatendimento).map((value) => value.nm_paciente)}
                        </div>
                        <div
                          id="OCULTA PARA MOBILE"
                          style={{
                            display: window.innerWidth < 800 ? 'none' : 'flex',
                          }}
                        >
                          <button
                            className="blue-button"
                            title="STATUS DA INTERCONSULTA. CLIQUE PARA ACESSAR O PRONTUĂRIO."
                            onClick={
                              item.status == 2
                                ? () => {
                                  gotoProntuario(item)
                                }
                                : ''
                            }
                            style={{
                              width:
                                window.innerWidth < 800
                                  ? 0.4 * window.innerWidth
                                  : 0.15 * window.innerWidth,
                              maxWidth:
                                window.innerWidth < 800
                                  ? 0.4 * window.innerWidth
                                  : 0.15 * window.innerWidth,
                              minWidth:
                                window.innerWidth < 800
                                  ? 0.4 * window.innerWidth
                                  : 0.15 * window.innerWidth,
                              margin: 2.5,
                              padding: 5,
                              flexDirection: 'column',
                              backgroundColor:
                                item.status == 1
                                  ? '#ec7063'
                                  : item.status == 2
                                    ? '#f5b041'
                                    : '#52be80',
                            }}
                          >
                            {item.status == 1 ? 'PENDENTE' : item.status == 2 ? 'ACOMPANHANDO' : 'ENCERRADO'}
                          </button>
                          <button
                            className="green-button"
                            onClick={() => updateInterconsulta(item, 2)}
                            title={
                              item.status == 1
                                ? 'SALVAR PARECER E ACOMPANHAR PACIENTE.'
                                : 'INTERCONSULTA JĂ RESPONDIDA.'
                            }
                            style={{
                              display: item.status == 2 ? 'none' : 'flex',
                              opacity:
                                item.status != 0 && item.status != 1
                                  ? 0.5
                                  : 1,
                              width:
                                window.innerWidth < 800
                                  ? 0.15 * window.innerWidth
                                  : 50,
                              maxWidth:
                                window.innerWidth < 800
                                  ? 0.15 * window.innerWidth
                                  : 50,
                              minWidth:
                                window.innerWidth < 800
                                  ? 0.15 * window.innerWidth
                                  : 50,
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
                            className="red-button"
                            onClick={() => updateInterconsulta(item, 3)}
                            title="ENCERRAR A INTERCONSULTA (ALTA)."
                            style={{
                              opacity: item.status == 2 ? 1 : 0.5,
                              width:
                                window.innerWidth < 800
                                  ? 0.15 * window.innerWidth
                                  : 50,
                              maxWidth:
                                window.innerWidth < 800
                                  ? 0.15 * window.innerWidth
                                  : 50,
                              minWidth:
                                window.innerWidth < 800
                                  ? 0.15 * window.innerWidth
                                  : 50,
                              marginRight: -5,
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
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        width: '100%',
                      }}
                    >
                      <div
                        id="EXIBE PARA MOBILE"
                        style={{
                          display: window.innerWidth < 800 ? 'flex' : 'none',
                        }}
                      >
                        <button
                          className="blue-button"
                          title="STATUS DA INTERCONSULTA. CLIQUE PARA ACESSAR O PRONTUĂRIO."
                          onClick={
                            item.status > 1 ? () => gotoProntuario(item) : ''
                          }
                          style={{
                            width: '100%',
                            margin: 2.5,
                            padding: 5,
                            flexDirection: 'column',
                            backgroundColor:
                              item.status == 1
                                ? '#ec7063'
                                : item.status == 2
                                  ? '#f5b041'
                                  : '#52be80',
                          }}
                        >
                          {item.status == 1
                            ? 'PENDENTE'
                            : item.status == 2
                              ? 'ACOMPANHANDO'
                              : 'ENCERRADO'}
                        </button>
                        <button
                          className="green-button"
                          onClick={() => updateInterconsulta(item, 2)}
                          title={
                            item.status == 1
                              ? 'SALVAR PARECER E ACOMPANHAR PACIENTE.'
                              : 'INTERCONSULTA JĂ RESPONDIDA.'
                          }
                          style={{
                            opacity:
                              item.status != 0 && item.status != 1 ? 0.5 : 1,
                            width:
                              window.innerWidth < 800
                                ? 0.15 * window.innerWidth
                                : 50,
                            maxWidth:
                              window.innerWidth < 800
                                ? 0.15 * window.innerWidth
                                : 50,
                            minWidth:
                              window.innerWidth < 800
                                ? 0.15 * window.innerWidth
                                : 50,
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
                          className="red-button"
                          onClick={() => updateInterconsulta(item, 3)}
                          title="ENCERRAR A INTERCONSULTA (ALTA)."
                          style={{
                            opacity: item.status == 2 ? 1 : 0.5,
                            width:
                              window.innerWidth < 800
                                ? 0.15 * window.innerWidth
                                : 50,
                            maxWidth:
                              window.innerWidth < 800
                                ? 0.15 * window.innerWidth
                                : 50,
                            minWidth:
                              window.innerWidth < 800
                                ? 0.15 * window.innerWidth
                                : 50,
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
                      </div>
                      <button
                        className="blue-button"
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'left',
                          width: '100%',
                          padding: 10,
                          margin: 2.5,
                        }}
                      >
                        {'MOTIVO: ' + item.motivo}
                      </button>
                      <textarea
                        className="textarea"
                        title="PARECER DO ESPECIALISTA."
                        id="inputParecer"
                        // onKeyUp={(e) => updateParecer(e.target.value)}
                        disabled={item.status != 1 ? true : false}
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'left',
                          width: '100%',
                          padding: 10,
                          margin: 2.5,
                        }}
                        type="text"
                        maxLength={200}
                        defaultValue={item.parecer}
                      ></textarea>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return null
    }
  }

  // funĂ§ĂŁo para construĂ§ĂŁo dos toasts.
  const [valor, setvalor] = useState(0)
  const [cor, setcor] = useState('transparent')
  const [mensagem, setmensagem] = useState('')
  const [tempo, settempo] = useState(2000)
  const toast = (value, color, message, time) => {
    setvalor(value)
    setcor(color)
    setmensagem(message)
    settempo(time)
    setTimeout(() => {
      setvalor(0)
    }, time)
  }

  const [pct, setpct] = useState([])
  const [lto, setlto] = useState([])
  const mountDataChart = () => {
    // obtendo o total de pacientes internados em todas as unidades.
    axios.get(htmlrodrigo + '/atendimentos').then((response) => {
      var x = [0, 1]
      x = response.data
      setpct(
        x.filter(
          (value) => value.ativo !== 0 && value.hospital == nomehospital,
        ),
      )
    })
    // obtendo o total de leitos para a unidade.
    axios.get(htmlleitos).then((response) => {
      var x = [0, 1]
      x = response.data
      setlto(response.data)
    })
  }

  // efetuando a soma de leitos.
  function somaLeitos(total, num) {
    return total + num
  }

  // CHART.
  /* grĂĄfico em torta que exibe o total de leitos vagos e o total
  de leitos ocupados para cada unidade. */
  var dataChart = []
  var dataChartBlocoCirurgico = []
  var dataChartConsultas = []
  var dataChartMif = []
  var dataChartPlanoTerapeutico = []
  const [renderchart, setrenderchart] = useState(0);

  // card para acesso Ă  lista de todos os pacientes.
  function TodosPacientes() {
    return (
      <div id="invĂłlucro"
        style={{
          display: 'flex', flexDirection: 'row',
          backgroundColor: '#ffffff', margin: 10,
          borderRadius: 5,
          boxShadow: '0px 2px 20px 5px rgba(0, 0, 0, 0.1)',
          maxHeight: '60vh',
          width: window.innerWidth < 600 ? '90vw' : '',
        }}>
        <div
          className="card"
          onClick={() => history.push('/todospacientes')}
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            // alignSelf: window.innerWidth > 400 ? 'flex-start' : 'center',
            borderRadius: 5,
            padding: 10,
            width: window.innerWidth < 600 ? '100%' : '20vw',
            minWidth: window.innerWidth < 600 ? '90%' : '20vw',
          }}
        >
          <img
            alt=""
            src={lupa}
            style={{
              display: window.innerWidth > 400 ? 'flex' : 'none',
              height: '20%',
              marginTop: window.innerWidth > 800 ? 0 : 0,
              marginBottom: window.innerWidth > 800 ? 0 : 60,
            }}
          ></img>
          <div
            className="title2"
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              margin: 10,
              padding: 0,
              height: 75,
              width: '100%',
              textAlign: 'center',
            }}
          >
            {'BUSCAR PACIENTES EM TODAS AS UNIDADES'}
          </div>
        </div>
      </div>
    )
  }

  var atendimentos = [0, 1]
  function GetData(item) {
    // gerando os dados dos grĂĄficos.
    var leitos = [0, 1]
    leitos = todosleitos
    atendimentos = todosatendimentos
    dataChart = {
      labels: [' LIVRES', ' OCUPADOS'],
      datasets: [
        {
          data: [
            leitos.filter((value) => value.unidade.id == item.id).length - atendimentos.filter(value => value.Leito.unidade.id == item.id).length, // todos os leitos - atendimentos = leitos vagos
            atendimentos.filter(value => value.Leito.unidade.id == item.id).length, // leitos ocupados.
          ],
          backgroundColor: ['lightgray', '#8f9bbc'],
          borderColor: '#ffffff',
          hoverBorderColor: ['#ffffff', '#ffffff'],
        },
      ],
    }

    var valor1 = todosatendimentos.filter(
      (value) =>
        value.unidade_id == item.id &&
        value.assistente == nomeusuario &&
        JSON.stringify(value.admissao).substring(4, 11) ==
        moment().subtract(2, 'months').format('MM/yyyy'),
    ).length
    var valor2 = todosatendimentos.filter(
      (value) =>
        value.unidade == item.unidade &&
        value.assistente == nomeusuario &&
        JSON.stringify(value.admissao).substring(4, 11) ==
        moment().subtract(1, 'months').format('MM/yyyy'),
    ).length
    var valor3 = todosatendimentos.filter(
      (value) =>
        value.unidade == item.unidade &&
        value.assistente == nomeusuario &&
        JSON.stringify(value.admissao).substring(4, 11) ==
        moment().format('MM/yyyy'),
    ).length
    dataChartConsultas = {
      labels: [
        moment().subtract(2, 'months').format('MM/yy'),
        moment().subtract(1, 'month').format('MM/yy'),
        moment().format('MM/yy'),
      ],
      datasets: [
        {
          data: [valor1, valor2, valor3],
          pointBackgroundColor: ['#52be80', '#52be80', '#52be80'],
          fill: true,
          backgroundColor: 'rgba(82, 190, 128, 0.3)',
          borderColor: 'rgba(82, 190, 128, 1)',
          hoverBorderColor: ['#E1E5F2', '#E1E5F2', '#E1E5F2'],
        },
      ],
    }

    // extrair da tabela MIF, filtrando por hospital e unidade.
    var arraymif = [];
    var count = 0;
    // var arraymif = listmif.filter(valor => valor.unidade == item.unidade).map(item => item.mif);

    var dataMif = [30, 35, 32, 45, 50, 65, 55, 35, 25, 15, 30, 35, 32, 45, 50, 65, 55, 35, 25, 15, 30, 35, 32, 45, 50, 65, 55, 35, 25, 15]
    var colorMif = dataMif.map(item => item < 50 ? '#ec7063' : '#52be80')
    dataChartMif = {
      labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      datasets: [
        {
          data: dataMif,
          fill: true,
          backgroundColor: colorMif,
          borderColor: 'rgba(82, 190, 128, 1)',
          hoverBorderColor: ['#E1E5F2', '#E1E5F2', '#E1E5F2'],
          borderRadius: 5,
        },
      ],
    }
    var dataPlanoTerapeutico = [30, 35, 32, 45, 50, 65, 55, 35, 25, 15, 30, 35, 32, 45, 50, 65, 55, 35, 25, 15, 30, 35, 32, 45, 50, 65, 55, 35, 25, 15]
    var colorPlanoTerapeutico = dataPlanoTerapeutico.map(item => item < 30 ? '#ec7063' : '#52be80')
    dataChartPlanoTerapeutico = {
      labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      datasets: [
        {
          data: dataPlanoTerapeutico,
          fill: true,
          backgroundColor: colorPlanoTerapeutico,
          borderColor: 'rgba(82, 190, 128, 1)',
          hoverBorderColor: ['#E1E5F2', '#E1E5F2', '#E1E5F2'],
        },
      ],
    }
    // renderizando os grĂĄficos.
    return (
      <div id="invĂłlucro"
        style={{
          display: 'flex', flexDirection: 'row',
          backgroundColor: '#ffffff', margin: 10,
          borderRadius: 5,
          boxShadow: '0px 2px 20px 5px rgba(0, 0, 0, 0.1)',
          maxHeight: '60vh',
          width: window.innerWidth < 600 ? '90vw' : '',
        }}>
        <div id={"hospital" + item.id}
          className="card"
          onClick={() => selectUnidade(item)}
          style={{
            position: 'relative',
            display: renderchart == 1 ? 'flex' : 'none',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            // alignSelf: window.innerWidth > 400 ? 'flex-start' : 'center',
            borderRadius: 5,
            padding: 10,
            width: window.innerWidth < 600 ? '100%' : '20vw',
            minWidth: window.innerWidth < 600 ? '90%' : '20vw',
          }}
        >
          <div
            className="title2"
            style={{
              fontSize: 22,
              fontWeight: 'bold',
              margin: 10,
              padding: 0,
              height: 75,
              width: '100%',
              textAlign: 'center',
            }}
          >
            {item.descricao}
          </div>
          <div
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
            <Doughnut
              data={dataChart}
              width={window.innerWidth > 400 ? 0.13 * window.innerWidth : 200}
              height={window.innerWidth > 400 ? 0.13 * window.innerWidth : 200}
              plugins={ChartDataLabels}
              options={{
                plugins: {
                  datalabels: {
                    display: function (context) {
                      return context.dataset.data[context.dataIndex] !== 0
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
                    hoverBorderColor: '#E1E5F2',
                    borderColor: '#E1E5F2',
                    borderWidth: 5,
                  },
                },
                animation: {
                  duration: 0,
                },
                title: {
                  display: false,
                  text: 'OCUPAĂĂO DE LEITOS',
                },
                legend: {
                  display: false,
                  position: 'bottom',
                },
                maintainAspectRatio: true,
                responsive: false,
              }}
            />
            {BtnInterconsultas(item)}
            <div id="OCUPAĂĂO">
              <div
                id="OCUPAĂĂO"
                className="title2center"
                style={{
                  display: 'flex', flexDirection: 'column', justifyContent: 'center',
                  alignSelf: 'center',
                  position: 'absolute', top: 5, left: 5, right: 5, bottom: 5,
                  fontWeight: 'bold',
                  margin: 2.5,
                  padding: 0, fontSize: 20
                }}
              >
                {
                  Math.ceil(atendimentos.filter(value => value.Leito.unidade.id == item.id).length * 100 /
                    leitos.filter((value) => value.unidade.id == item.id).length) + '%'}
              </div>
            </div>
          </div>
          <div id="LEGENDA"
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              flexWrap: 'wrap',
              marginTop: 5,
              marginBottom: 5,
              boxShadow: 'none',
              width: '100%'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
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
              display: window.innerWidth > 800 ? 'flex' : 'none', flexDirection: 'column',
              justifyContent: 'center', alignItems: 'center'
            }}>
              <div
                id="LEITOS VAGOS"
                className="secondary"
                style={{
                  display: 'flex',
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
          <div id={"expandbtn" + item.id}
            className="blue-button"
            style={{
              width: 25, minWidth: 25, height: 25, minHeight: 25,
              position: 'absolute', bottom: 5, right: 5
            }}
            onClick={(e) => {
              document.getElementById("hospitaisstuff" + item.id).style.opacity = 0
              document.getElementById("expandbtn" + item.id).style.display = "none"
              document.getElementById("retractbtn" + item.id).style.display = "flex"

              document.getElementById("hospitaisstuff" + item.id).classList = "expandcard";
              setTimeout(() => {
                var position = document.getElementById("hospital" + item.id).offsetTop;
                document.getElementById("LISTA DE UNIDADES").scrollTop = position - 245;
                document.getElementById("hospitaisstuff" + item.id).style.opacity = 1
              }, 500);

              e.stopPropagation();
            }}
          >
            +
          </div>
          <div id={"retractbtn" + item.id}
            className="blue-button"
            onClick={(e) => {
              document.getElementById("hospitaisstuff" + item.id).style.opacity = 0
              setTimeout(() => {
                document.getElementById("expandbtn" + item.id).style.display = "flex"
                document.getElementById("retractbtn" + item.id).style.display = "none"
                document.getElementById("hospitaisstuff" + item.id).className = "retractcard"
              }, 500);
              e.stopPropagation();
            }}
            style={{
              display: 'none',
              width: 25, minWidth: 25, height: 25, minHeight: 25,
              position: 'absolute', bottom: 5, right: 5
            }}
          >
            -
          </div>

        </div>

        <div id={"hospitaisstuff" + item.id} className="retractcard"
          style={{ display: 'flex', flexDirection: 'row' }}>

          <button
            onClick={(e) => { history.push('/escala'); e.stopPropagation() }}
            className="blue-button"
            style={{
              display: tipousuario == 2 ? 'flex' : 'none',
              minHeight: '15vw', minWidth: '15vw',
              margin: 10, padding: 10, height: 50
            }}
          >
            ESCALA PROFISSIONAL
          </button>

          <button
            id="cardbunda"
            className="widget"
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', padding: 5, margin: 10 }}
          >
            <div className="pulsewidgettittle">LOCALIZAR PACIENTES</div>
            <div className="pulsewidgetcontent"
              style={{ backgroundColor: 'transparent', borderColor: 'transparent' }}
            >
              {radarPacientes(item)}
            </div>
          </button>
        </div>
      </div>
    )
  }


  /* 
  LOCALIZAĂĂES (setores):
  
  */
  // radar/localizador de pacientes.

  const radarPacientes = (item) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div>{'PACIENTES NO SETOR: ' + todosatendimentos.filter(valor => valor.radar == item.unidade).length}</div>
        <div className="scroll" style={{ height: 200 }}>
          {todosatendimentos.filter(valor => valor.radar == item.unidade).map(item => (
            <div className="row">
              <button className="green-button" style={{ padding: 10, width: '100%' }}>{item.nome}</button>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 10 }}>PACIENTES AUSENTES</div>
        <div className="scroll" STYLE={{ height: 200 }}>
          {todosatendimentos.filter(valor => valor.radar != item.unidade).map(item => (
            <div className="row">
              <button className="green-button" style={{ padding: 10 }}>{item.nome}</button>
              <button className="green-button" style={{ width: 100 }}>{item.radar}</button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // grĂĄficos complementares ao expandir o card de unidades (nĂŁo utilizado no momento).
  function cardGraphics() {
    return (
      <div>
        <div id="grĂĄficoMIF"
          style={{
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            width: '15vw', height: '15vw', backgroundColor: "#F2F2F2", borderRadius: 5,
            padding: 10, margin: 10
          }}>
          <div className="title2center">MIF</div>
          <div className="scroll"
            style={{
              overflowY: 'hidden', overflowX: 'scroll',
              padding: 5,
            }}
          >
            <div
              style={{
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                width: '40vw',
                height: 100,
                padding: 5, paddingRight: 12
              }}>
              <Bar
                data={dataChartMif}
                // width={'100%'}
                // height={100}
                plugins={ChartDataLabels}
                options={{
                  scales: {
                    xAxes: [{
                      gridLines: {
                        display: false
                      },
                      ticks: {
                        display: false
                      }
                    }],
                    yAxes: [{
                      gridLines: {
                        display: false
                      },
                      ticks: {
                        display: false,
                        suggestedMin: 0,
                        suggestedMax: 100,
                      }
                    }]
                  },
                  plugins: {
                    datalabels: {
                      display: false,
                    },
                  },
                  tooltips: {
                    enabled: false,
                  },
                  hover: { mode: null },
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
                  maintainAspectRatio: false,
                  responsive: true,
                }}
              />
            </div>
          </div>
        </div>
        <div id="grĂĄficoPlanoTerapeutico"
          style={{
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            width: '15vw', height: '15vw', backgroundColor: "#F2F2F2", borderRadius: 5,
            padding: 10, margin: 10
          }}>
          <div className="title2center">PLANO TERAPĂUTICO</div>
          <div className="scroll"
            style={{
              overflowY: 'hidden', overflowX: 'scroll',
              padding: 5,
            }}
          >
            <div
              style={{
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                width: '40vw',
                height: 60,
                padding: 5, paddingRight: 12
              }}>
              <Bar
                data={dataChartPlanoTerapeutico}
                // width={'100%'}
                // height={100}
                plugins={ChartDataLabels}
                options={{
                  scales: {
                    xAxes: [{
                      gridLines: {
                        display: false
                      },
                      ticks: {
                        display: false
                      }
                    }],
                    yAxes: [{
                      gridLines: {
                        display: false
                      },
                      ticks: {
                        display: false,
                        suggestedMin: 0,
                        suggestedMax: 100,
                      }
                    }]
                  },
                  plugins: {
                    datalabels: {
                      display: false,
                    },
                  },
                  tooltips: {
                    enabled: false,
                  },
                  hover: { mode: null },
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
                  maintainAspectRatio: false,
                  responsive: true,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  function Escala(item) {
    if (tipousuario === 2 || tipousuario === 3) {
      // tipos 2 (gestor) e 3 (secretĂĄria).
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <button
            className="blue-button"
            style={{ width: 150, alignSelf: 'center' }}
            onClick={() => selectEscala(item)}
          >
            {'ESCALA'}
          </button>
        </div>
      )
    } else {
      return null
    }
  }

  // abrindo a tela de acolhimento (classificaĂ§ĂŁo de risco).
  const clickAcolhimento = (item) => {
    settipounidade(lto.filter(value => value.unidade == item.unidade).map(item => item.tipo))
    setnomeunidade(lto.filter(value => value.unidade == item.unidade).map(item => item.unidade))
    history.push('/acolhimento')
  }

  // botĂŁo para acesso ao painel do gestor.
  const [painelgestor, setpainelgestor] = useState(0);
  function PainelDoGestorBtn() {
    return (
      <button
        className={painelgestor == 1 ? "red-button" : "green-button"}
        style={{
          display: window.innerWidth > 400 ? 'flex' : 'none',
          width: 50, height: 50,
          alignSelf: 'flex-start',
          padding: 20,
          margin: 20,
          position: 'absolute',
          left: 10,
          bottom: 10,
        }}
        onClick={painelgestor == 1 ? () => setpainelgestor(0) : () => setpainelgestor(1)}
      >
        G
      </button>
    )
  }

  function PainelDoGestor() {
    return (
      <div className="scroll fade-in"
        style={{
          position: 'absolute', top: 20, bottom: 20, right: 20,
          borderColor: 'gray',
          backgroundColor: 'gray',
          borderRadius: 5,
          padding: 10,
          display: painelgestor == 1 ? 'flex' : 'none',
          width: '30vw',
          opacity: 1,
          zIndex: 2,
          boxShadow: '0px 2px 10px 5px rgba(0, 0, 0, 0.5)'
        }}>
        <Stuff></Stuff>
      </div>
    )
  }

  const [filterunidade, setfilterunidade] = useState('');
  var searchunidade = '';
  var timeout = null;

  const filterUnidade = () => {
    clearTimeout(timeout);
    document.getElementById("inputFilterUnidade").focus();
    searchunidade = document.getElementById("inputFilterUnidade").value.toUpperCase();
    timeout = setTimeout(() => {
      if (searchunidade == '') {
        setarrayunidades(unidades);
        document.getElementById("inputFilterUnidade").value = '';
        document.getElementById("inputFilterUnidade").focus();
      } else {
        setfilterunidade(document.getElementById("inputFilterUnidade").value.toUpperCase());
        setarrayunidades(unidades.filter(item => item.descricao.includes(searchunidade) == true));
        document.getElementById("inputFilterUnidade").value = searchunidade;
        document.getElementById("inputFilterUnidade").focus();
      }
    }, 500);
  }

  // filtro de unidades...
  function FilterUnidades() {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        <input
          className="input"
          autoComplete="off"
          placeholder="BUSCAR UNIDADE..."
          onFocus={(e) => (e.target.placeholder = '')}
          onBlur={(e) => (e.target.placeholder = 'BUSCAR UNIDADE...')}
          onChange={() => filterUnidade()}
          style={{
            width: '60vw',
            padding: 20,
            margin: 20,
            alignSelf: 'center',
            textAlign: 'center'
          }}
          type="text"
          id="inputFilterUnidade"
          defaultValue={filterunidade}
          maxLength={100}
        ></input>
      </div>
    )
  }

  // renderizaĂ§ĂŁo do componente.
  return (
    <div
      className="main fade-in"
      style={{
        display: renderchart == 1 ? 'flex' : 'none',
      }}
    >
      <PainelDoGestor></PainelDoGestor>
      <Header link={'/hospitais'} titulo={JSON.stringify(nomehospital).substring(3, JSON.stringify(nomehospital).length - 1)}></Header>
      <Toast valor={valor} cor={cor} mensagem={mensagem} tempo={tempo} />
      <FilterUnidades></FilterUnidades>
      <ShowUnidades></ShowUnidades>
      <ViewInterconsultas></ViewInterconsultas>
      <PainelDoGestorBtn></PainelDoGestorBtn>
    </div>
  )
}
export default Unidades
