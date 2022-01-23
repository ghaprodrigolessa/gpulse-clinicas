/* eslint eqeqeq: "off" */
import React, { useState } from 'react'
import { useEffect, useContext } from 'react'
import axios from 'axios'
import { Doughnut, Bar } from 'react-chartjs-2'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import Header from '../components/Header'
import Context from '../Context'
import { useHistory } from 'react-router-dom'
import change from '../images/change.svg'
import AptTransicaoDeServicos from '../components/AptTransicaoDeServicos'
import useInterval from 'react-useinterval'

function Hospitais() {
  var html = 'https://pulsarapp-server.herokuapp.com';
  var htmlempresas = process.env.REACT_APP_API_EMPRESAS;
  var htmlatendimentos = process.env.REACT_APP_API_ATENDIMENTOS;
  var htmlleitos = process.env.REACT_APP_API_LEITOS;
  let intervalatendimentos = null;
  // recuperando estados globais (Context.API).
  const {
    settodosleitos, todosleitos,
    idusuario, tipousuario,
    setnomehospital, setidhospital,
    settodosatendimentos, todosatendimentos,
    settodosconvenios, todosconvenios,
    refreshatendimentos,
  } = useContext(Context)
  // history (react-router-dom).
  let history = useHistory()

  // carregamento da lista de hospitais nos quais o usuário trabalha.
  const [hospitais, setHospitais] = useState([])
  const loadHospitais = () => {
    // ROTA: SELECT * FROM usuarioxhospital WHERE idusuario = loginid.
    axios.get(htmlempresas).then((response) => {
      setHospitais(response.data)
      // alert(response.data);
    })
  }
  // montando a lista de hospitais.
  const [loaddata, setloaddata] = useState(0);
  function ShowHospitais() {
    var leitos = [0, 1];
    leitos = todosleitos;
    return (
      <div
        className="scroll"
        id="LISTA DE HOSPITAIS"
        style={{
          scrollBehavior: 'smooth',
          height: '82vh', maxHeight: '82vh',
          flexDirection: window.innerWidth < 400 ? 'column' : 'row',
          flexWrap: window.innerWidth < 400 ? 'nowrap' : 'wrap',
          backgroundColor: 'transparent', borderColor: 'transparent'
        }}
      >
        {hospitais.map((item) =>
          GetData(item)
        )}
      </div>
    )
  }

  // selecionando um hospital da lista.
  const selectHospital = (item) => {
    setnomehospital(item.nome)
    setidhospital(item.id)
    history.push('/unidades')
  }
  // selecionando a tela de atendimentos (apenas secretária).
  const selectAtendimento = (item) => {
    history.push('/secretaria')
  }

  useEffect(() => {
    // scroll to top on render (importante para as versões mobile).
    window.scrollTo(0, 0)
    // carregando registros de atendimentos e de leitos para geração dos gráficos.
    loadAtendimentos();
    // carregando a lista de hospitais.
    loadHospitais();
  }, [])

  // carregando regitro de atendimentos.
  var htmlatendimentos = process.env.REACT_APP_API_ATENDIMENTOS;
  let arrayconvenios = [];
  const loadAtendimentos = () => {
    axios.get(htmlatendimentos).then((response) => {
      var x = [0, 1]
      x = response.data;
      settodosatendimentos(x.filter((value) => value.ativo != 0));
    })
  }
  // atualizando resgistro de atendimentos.
  useInterval(() => {
    console.log('ATUALIZANDO ATENDIMENTOS EM HOSPITAIS.');
    loadAtendimentos();
  }, 60000);

  // randomizando cores dos gráficos.
  const [randomcolors, setrandomcolors] = useState([]);
  var dynamicColors = function () {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return "rgba(" + r + "," + g + "," + b + ", 0.5)";
  };
  const [labelconvenios, setlabelconvenios] = useState([]);
  const mountConvenios = (item) => {
    var obj = {
      codigo: item.cd_convenio,
      nome: item.nm_convenio,
      color: dynamicColors(),
    }
    arrayconvenios.push(obj);
    arrayconvenios = arrayconvenios.filter((value, index, self) =>
      index === self.findIndex((t) => (t.codigo === value.codigo)));

    settodosconvenios(arrayconvenios);
    setlabelconvenios(arrayconvenios.map(item => item.nome));
    arrayconveniosdatachart = [];

    loadDataChartConvenios(arrayconvenios);
  }

  const loadDataChartConvenios = (value) => {
    // alert(arrayconvenios.length);
    value.map(item => mountDataChartConvenios(item.codigo));
  }

  let arrayconveniosdatachart = [];
  const [conveniosdatachart, setconveniosdatachart] = useState([]);
  const mountDataChartConvenios = (codigo) => {
    var dado = todosatendimentos.filter(item => item.cd_convenio == codigo).length;
    arrayconveniosdatachart.push(dado);
    setconveniosdatachart(arrayconveniosdatachart);
  }

  // CHART.
  /* gráfico em torta que exibe o total de leitos vagos e o total
  de leitos ocupados para cada hospital. */
  var dataChart = []
  var dataChartAtendimentosPorConvenios = []

  function GetData(item) {
    // gerando os dados do gráfico.
    var leitos = [0, 1]
    leitos = todosleitos;
    dataChart = {
      labels: [' LEITOS LIVRES', ' LEITOS OCUPADOS'],
      datasets: [
        {
          data: [
            leitos.filter((value) => value.unidade.setor.empresa.id == item.id).length // total de leitos
            -
            todosatendimentos.filter((value) => value.empresa_id == item.id).length, // atendimentos
            todosatendimentos.filter((value) => value.empresa_id == item.id).length // atendimentos
          ],
          backgroundColor: ['#52be80', '#F4D03F'],
          borderWidth: 5,
          borderColor: '#ffffff',
          borderRadius: 5,
          hoverBorderColor: ['#ffffff', '#ffffff'],
        },
      ],
    }

    dataChartAtendimentosPorConvenios = {
      labels: todosconvenios.map(item => item.nome),
      datasets: [
        {
          label: labelconvenios,
          data: conveniosdatachart,
          backgroundColor: todosconvenios.map(item => item.color),
          borderRadius: 5,
        },
      ],
    }

    if (leitos.filter((value) => value.unidade.setor.empresa.id == item.id).length > 0) {
      return (
        <div id="invólucro"
          style={{
            display: 'flex', flexDirection: 'row',
            backgroundColor: '#ffffff', margin: 10,
            borderRadius: 5,
            boxShadow: '0px 2px 20px 5px rgba(0, 0, 0, 0.1)',
            height: 450, width: window.innerWidth < 400 ? '90vw' : '',
          }}>
          <div
            id={"hospital" + item.id}
            className="card"
            onClick={() => selectHospital(item)}
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              alignSelf: window.innerWidth > 400 ? 'flex-start' : 'center',
              borderRadius: 5,
              padding: 10,
              width: window.innerWidth < 400 ? '100%' : '21vw',
              minWidth: window.innerWidth < 400 ? '90%' : '21vw',
              height: 420
            }}
          >
            <div
              className="title2center"
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
              {JSON.stringify(item.nome).substring(3, JSON.stringify(item.nome).length - 1)}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
              <Doughnut
                data={dataChart}
                width={window.innerWidth > 400 ? 0.13 * window.innerWidth : 200}
                height={window.innerWidth > 400 ? 0.13 * window.innerWidth : 200}
                maintainAspectRatio={true}
                responsive={true}
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
                      hoverBorderColor: 'rgba(143, 155, 188, 0.3)',
                      borderColor: 'rgba(143, 155, 188, 0.3)',
                      borderWidth: 5,
                    },
                  },
                  animation: {
                    duration: 0,
                  },
                  title: {
                    display: false,
                    text: 'OCUPAÇÃO DE LEITOS',
                  },
                  legend: {
                    display: false,
                    position: 'bottom',
                  },
                  maintainAspectRatio: true,
                  responsive: false,
                }}
              />
              <div id="OCUPAÇÃO">
                <div
                  id="OCUPAÇÃO"
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
                    Math.ceil(
                      (todosatendimentos.filter((value) => value.empresa_id == item.id).length * 100) /
                      leitos.filter((value) => value.unidade.setor.empresa.id == item.id).length,
                    ) +
                    '%'}
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
                    backgroundColor: '#5dbe80',
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
                  LEITOS VAGOS
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div
                  id="LEITOS OCUPADOS"
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
                  {window.innerWidth > 400 ? 'OCUPADOS' : 'OCUPADOS'}
                </p>
              </div>
            </div>
            <div
              className="blue-button"
              id={"expandbtn" + item.id}
              style={{
                width: 25, minWidth: 25, height: 25, minHeight: 25,
                position: 'absolute', bottom: 5, right: 5
              }}
              onMouseEnter={() => {
                // carregando convênios.
                todosatendimentos.map(item => mountConvenios(item));
              }}
              onClick={(e) => {
                document.getElementById("hospitaisstuff" + item.id).style.opacity = 0
                document.getElementById("expandbtn" + item.id).style.display = "none"
                document.getElementById("retractbtn" + item.id).style.display = "flex"

                //var botoes = document.getElementById("LISTA DE HOSPITAIS").getElementsByClassName("expandcard");
                //for (var i = 0; i < botoes.length; i++) {
                //botoes.item(i).className = "retractcard";
                //}
                document.getElementById("hospitaisstuff" + item.id).classList = "expandcard";
                setTimeout(() => {
                  var position = document.getElementById("hospital" + item.id).offsetTop;
                  document.getElementById("LISTA DE HOSPITAIS").scrollTop = position - 155;
                  document.getElementById("hospitaisstuff" + item.id).style.opacity = 1
                }, 500);

                e.stopPropagation();
              }}
            >
              +
            </div>
            <div
              className="blue-button"
              id={"retractbtn" + item.id}
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
          <div id={"hospitaisstuff" + item.id} className="retractcard" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center' }}>
              <div className="scrollhorizontalhover"
                style={{
                  display: 'flex', opacity: 1, position: 'relative',
                  width: '65vw', height: '40vh', margin: 10,
                  overflowY: 'hidden',
                }}>
                <Bar
                  data={dataChartAtendimentosPorConvenios}
                  width="200"
                  height="50"
                  plugins={ChartDataLabels}
                  padding={10}
                  options={{
                    tooltips: {
                      enabled: false
                    },
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
                            display: true,
                            suggestedMin: 0,
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
                    legend: {
                      display: false,
                      position: 'bottom',
                    },
                    maintainAspectRatio: true,
                    responsive: true,
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                {todosconvenios.map(valor => (
                  <div className="card" style={{ flexDirection: 'column', width: '9.5vw', height: '13vw', justifyContent: 'space-between' }}>
                    <div className="title2center">{valor.nome}</div>
                    <div style={{ margin: 10 }}>
                      <Doughnut
                        data={{
                          labels: [
                            'CRÔNICOS',
                            'PALIATIVO',
                            'REABILITAÇÃO',
                          ],
                          datasets: [
                            {
                              data: [
                                todosatendimentos.filter(value => value.hospital == item.hospital && value.convenio == valor.convenio && value.linhadecuidado == 1).length,
                                todosatendimentos.filter(value => value.hospital == item.hospital && value.convenio == valor.convenio && value.linhadecuidado == 2).length,
                                todosatendimentos.filter(value => value.hospital == item.hospital && value.convenio == valor.convenio && value.linhadecuidado == 3).length,
                              ],
                              fill: true,
                              backgroundColor: ['#52be80', '#5DADE2', '#F4D03F'],
                              borderColor: 'white',
                              hoverBorderColor: ['#E1E5F2', '#E1E5F2', '#E1E5F2'],
                            },
                          ],
                        }}
                        padding={10}
                        width={window.innerWidth > 400 ? '100%' : 150}
                        height={window.innerWidth > 400 ? '80%' : 150}
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
                              hoverBorderColor: 'rgba(143, 155, 188, 0.3)',
                              borderColor: 'rgba(143, 155, 188, 0.3)',
                              borderWidth: 2.5,
                            },
                          },
                          animation: {
                            duration: 0,
                          },
                          title: {
                            display: false,
                            text: 'OCUPAÇÃO DE LEITOS',
                          },
                          legend: {
                            display: false,
                            position: 'bottom',
                          },
                          maintainAspectRatio: true,
                          responsive: false,
                        }}
                      />
                    </div>
                  </div>
                ))}
                <button className="green-button"
                  style={{ flexDirection: 'column', width: '9.5vw', height: '13vw', margin: 15, padding: 5 }}
                  onClick={() => {
                    settransition(0);
                    setTimeout(() => {
                      settransition(1);
                    }, 500);
                  }}
                >
                  <img alt="" src={change} style={{ height: 50, width: 50 }}></img>
                  <div className="title2center"
                    style={{
                      display: window.innerWidth > 800 ? 'flex' : 'none',
                      color: '#ffffff', fontSize: 12, margin: 0, padding: 0
                    }}>
                    PACIENTES EM TRANSIÇÃO DE SERVIÇOS:</div>
                  <div className="title2center" style={{ color: '#ffffff', fontSize: 16, marginTop: 0 }}>12</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return null;
    }
  }

  // tela que permite a transição de pacientes entre os serviços oferecidos (ex: hospital >> atendimento domiciliar).
  const [transition, settransition] = useState(0);

  // renderização do componente.
  return (
    <div
      className="main fade-in"
      style={{
        display: 'flex',
      }}
    >
      <Header link={'/'} titulo={'SERVIÇOS'}></Header>
      <ShowHospitais></ShowHospitais>
      <AptTransicaoDeServicos transition={transition}></AptTransicaoDeServicos>
    </div>
  )
}
export default Hospitais