/* eslint eqeqeq: "off" */
import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/pt-br';
import MaskedInput from 'react-maskedinput';
import Context from '../Context';
import Toast from './Toast';
import PrintPrescricao from './PrintPrescricao';
// importando css.
import '../design.css';
// importando imagens.
import clock from '../images/clock.svg';
import deletar from '../images/deletar.svg';
import suspender from '../images/suspender.svg';
import salvar from '../images/salvar.svg';
import copiar from '../images/copiar.svg';
import imprimir from '../images/imprimir.svg';
import novo from '../images/novo.svg';
import { Hemoderivados } from './Hemoderivados';

function Prescricao({ newprescricao }) {
  moment.locale('pt-br');
  var html = 'https://pulsarapp-server.herokuapp.com';

  var htmlprescricoes = process.env.REACT_APP_API_CLONE_PRESCRICOES;
  var htmlinsertprescricao = process.env.REACT_APP_API_CLONE_INSERTPRESCRICAO;
  var htmlupdateprescricao = process.env.REACT_APP_API_CLONE_UPDATEPRESCRICAO;
  var htmldeleteprescricao = process.env.REACT_APP_API_CLONE_DELETEPRESCRICAO;

  var htmlopcoesitensprescricao = process.env.REACT_APP_API_CLONE_OPCOES_ITENS_PRESCRICAO;
  var htmlitensatendimento = process.env.REACT_APP_API_CLONE_ITENSATENDIMENTO;
  var htmlitensprescricao = process.env.REACT_APP_API_CLONE_ITENSPRESCRICAO;
  var htmlinsertitemprescricao = process.env.REACT_APP_API_CLONE_INSERTITEMPRESCRICAO;
  var htmlupdateitemprescricao = process.env.REACT_APP_API_CLONE_UPDATEITEMPRESCRICAO;
  var htmldeleteitemprescricao = process.env.REACT_APP_API_CLONE_DELETEITEMPRESCRICAO;

  var htmlopcoescomponentesprescricao = process.env.REACT_APP_API_CLONE_OPCOES_COMPONENTES_PRESCRICAO;
  var htmlcomponentesprescricao = process.env.REACT_APP_API_CLONE_COMPONENTESPRESCRICAO;
  var htmlinsertcomponenteprescricao = process.env.REACT_APP_API_CLONE_INSERTCOMPONENTEPRESCRICAO;
  var htmlupdatecomponenteprescricao = process.env.REACT_APP_API_CLONE_UPDATECOMPONENTEPRESCRICAO;
  var htmldeletecomponenteprescricao = process.env.REACT_APP_API_CLONE_DELETECOMPONENTEPRESCRICAO;
  var htmldeletecomponenteprescricaopontual = process.env.REACT_APP_API_CLONE_DELETECOMPONENTEPRESCRICAOPONTUAL


  var htmlbuscaitemprescricao = process.env.REACT_APP_API_BUSCAITEMPRESCRICAO;
  // recuperando estados globais (Context.API).
  const {
    idusuario,
    nomeusuario,
    tipousuario,
    especialidadeusuario,
    conselhousuario,
    idatendimento,
    idpaciente,
    box,
    nomehospital,
    tipounidade,
    nomeunidade,
    nomepaciente,
    dn,
    setpickdate1,
    stateprontuario,
    sethemoderivados,
    scrollmenu, setscrollmenu,
    scrollprescricao, setscrollprescricao,
    scrollitem, setscrollitem,
    scrollitemcomponent, setscrollitemcomponent,
    listitensprescricao, setlistitensprescricao,
  } = useContext(Context)

  // itens dispon??veis para prescri????o
  const loadBuscaItemPrescricao = (valor) => {
    axios.get(htmlopcoesitensprescricao).then((response) => {
      var x = [0, 1]
      var y = [0, 1]
      x = response.data
      y = x.rows
      setarrayoptionsitens(x.rows);
      // setfilteroptionsitens(y.filter(item => item.ds_produto.includes(value) == true));
      document.getElementById("inputFilterItemPrescricao").value = valor;

      // alert(valor);
      // alert(arrayoptionsitens.map(item => item.ds_tip_presc));
    })
  }

  const [viewselectmodelprescription, setviewselectmodelprescription] = useState(newprescricao);
  useEffect(() => {
    if (stateprontuario == 9) {
      setviewselectmodelprescription(newprescricao);
      loadPrescricoes();
      // loadAtendimento();
      loadOptionsItens();
      loadOptionsComponentes();
      loadAntibioticos();
      // limpando debris da prescri????o...
      setidprescricao('');
      setfilteritemprescricao('');
      setarrayoptionsitens([]);
      setarrayitemprescricao([]);
      // getHorarios();
    } else if (stateprontuario == 10) {
      // loadCheckPrescricoes();
      // getHorarios();
    }
  }, [stateprontuario, newprescricao])

  // LISTA DE PRESCRI????ES.
  // constantes relacionadas ?? lista de prescricoes:
  const [idprescricao, setidprescricao] = useState(0);
  // constantes relacionadas ?? lista de items da prescri????o:
  const [id, setid] = useState(0);
  const [iditem, setiditem] = useState(0);
  // const [iditem, setiditem] = useState(0);
  const [nome_item, setnome_item] = useState('');
  const [keyword_item, setkeyword_item] = useState('');
  const [status, setstatus] = useState(0);

  const [qtde, setqtde] = useState(0);
  const [via, setvia] = useState(0);
  const [horario, sethorario] = useState(moment());
  const [observacao, setobservacao] = useState('');
  const [justificativa, setjustificativa] = useState('');
  const [aprazamento, setaprazamento] = useState(0);

  // Refs (persistir valor sem rerenderizar).
  const inputQtdeRef = React.useRef(0);
  const inputViaRef = React.useRef('');

  const [tipoitem, settipoitem] = useState(0);
  const [tag_componente, settag_componente] = useState(0);

  // constantes relacionadas ?? lista de componentes
  const [codigo, setcodigo] = useState(0);
  const [idcomponente, setidcomponente] = useState(0);
  const [componente, setcomponente] = useState('');
  const [qtdecomponente, setqtdecomponente] = useState(0);

  // carregando atendimento do paciente.
  const [listatendimentos, setlistatendimentos] = useState([0, 1]);
  const loadAtendimento = () => {
    axios.get(html + "/atendimentos").then((response) => {
      var x = [0, 1];
      var y = [0, 1];
      x = response.data;
      y = x.filter(item => item.id == idatendimento);
      setlistatendimentos(y);
    });
  }

  // carregando a lista de prescri????es.
  const [listprescricoes, setlistprescricoes] = useState([]);
  const loadPrescricoes = () => {
    axios.get(htmlprescricoes + idatendimento).then((response) => {
      var x = [0, 1]
      x = response.data;
      setlistprescricoes(x.rows);
    });
  }

  // lista de itens dispon??veis para inser????o na prescri????o.
  const [optionsitens, setoptionsitens] = useState([]);
  const loadOptionsItens = () => {
    axios.get(htmlopcoesitensprescricao).then((response) => {
      var x = [0, 1];
      x = response.data;
      setoptionsitens(x.rows);
      // setarrayoptionsitens(x.rows);
    });
  }

  // carregando a lista com todas as op????es de componentes dispon??veis no sistema.
  const [optionscomponentes, setoptionscomponentes] = useState();
  const loadOptionsComponentes = () => {
    axios.get(htmlopcoescomponentesprescricao).then((response) => {
      var x = [0, 1];
      x = response.data;
      setoptionscomponentes(x.rows);
      setarrayfiltercomponente(x.rows);
    });
  }

  // filtro dos itens para prescri????o.
  // 1. filtrando os itens j?? presentes na prescri????o.
  const [filteritemprescricao, setfilteritemprescricao] = useState('');
  const [arrayitemprescricao, setarrayitemprescricao] = useState([]);
  // 2. filtrando op????es de itens que poder??o ser inseridos na prescri????o.
  const [filteroptionsitens, setfilteroptionsitens] = useState('');
  const [arrayoptionsitens, setarrayoptionsitens] = useState([optionsitens]);
  var searchitemprescricao = '';
  var timeout = null;
  const filterItemPrescricao = () => {
    clearTimeout(timeout);
    document.getElementById("inputFilterItemPrescricao").focus();
    searchitemprescricao = document.getElementById("inputFilterItemPrescricao").value.toUpperCase();
    timeout = setTimeout(() => {
      var arr = listitensprescricao.filter((value, index, self) =>
        index === self.findIndex((item) => (
          item.nome_item === value.nome_item
        ))
      )
      setTimeout(() => {
        setarrayitemprescricao(arr);
        if (searchitemprescricao == '') {
          setfilteritemprescricao('');
          setarrayitemprescricao(arr);
          setarrayoptionsitens([]);
          document.getElementById("inputFilterItemPrescricao").value = '';
          document.getElementById("inputFilterItemPrescricao").focus();
        } else {
          setfilteritemprescricao(document.getElementById("inputFilterItemPrescricao").value.toUpperCase());
          setarrayitemprescricao(arr.filter(item => item.nome_item.includes(searchitemprescricao) == true));
          setarrayoptionsitens(optionsitens.filter(item => item.ds_produto.includes(searchitemprescricao) == true));
          // setarrayoptionsitens(optionsitens.filter(item => item.farmaco.includes(searchitemprescricao) === true));
          // if (tipousuario == 5) {
          // setarrayoptionsitens(optionsitens.filter(item => item.farmaco.includes(searchitemprescricao) === true && item.grupo === 'ENFERMAGEM')); // separando itens que podem ser prescritos pela enfermagem.
          //}

          document.getElementById("inputFilterItemPrescricao").value = searchitemprescricao;
          document.getElementById("inputFilterItemPrescricao").focus();
        }
      }, 2000);
    }, 500);
  }
  // memorizando a posi????o da scroll nas listas.
  var timeout;

  // corrigindo glitches com scrolls.
  const scrollPosition = () => {
    setscrollitem(document.getElementById("LISTA DE ITENS PRESCRITOS").scrollTop);
    document.getElementById("LISTA DE ITENS PRESCRITOS").scrollTop = scrollitem;
  }
  const keepScroll = () => {
    document.getElementById("LISTA DE ITENS PRESCRITOS").scrollTop = scrollitem;
  }

  const scrollPositionTec = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      setscrollprescricao(document.getElementById("LISTA DE PRESCRI????ES").scrollTop);
      setscrollitem(document.getElementById("LISTA DE ITENS PRESCRITOS - T??CNICO").scrollTop);
      document.getElementById("LISTA DE PRESCRI????ES").scrollTop = scrollprescricao;
      document.getElementById("LISTA DE ITENS PRESCRITOS - T??CNICO").scrollTop = scrollitem;
    }, 200);
  }
  const keepScrollTec = () => {
    document.getElementById("LISTA DE PRESCRI????ES").scrollTop = scrollprescricao;
    document.getElementById("LISTA DE ITENS PRESCRITOS - T??CNICO").scrollTop = scrollitem;
  }

  // renderizando a impress??o de uma prescri????o selecionada.
  const [viewprintprescricao, setviewprintprescricao] = useState(0);
  const viewPrintPrescricao = (item) => {
    setviewprintprescricao(0);
    setTimeout(() => {
      setdataprescricao(item.data);
      setidprescricao(item.id);
      setstatusprescricao(item.status);
      setviewprintprescricao(1);
    }, 500);
  }

  // IDENTIFICA????O DO PACIENTE.
  function Paciente() {
    return (
      <div
        id="identifica????o"
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 5,
          padding: 0,
          width: '100%'
        }}
      >
        <button
          className="blue-button"
          style={{
            display: tipounidade != 4 ? 'flex' : 'none',
            position: 'sticky',
            top: 0,
            width: window.innerWidth > 800 ? 90 : 0.1 * window.innerWidth,
            textTransform: 'uppercase',
            backgroundColor: '#279AB1',
            color: '#FFFFFF',
            margin: 5,
            padding: 5,
          }}
          id="inputBox"
          title={"BOX"}
        >
          {box}
        </button>
        <button
          className="blue-button"
          style={{
            backgroundColor: '#279AB1',
            color: '#FFFFFF',
            width: '100%',
            textTransform: 'uppercase',
            margin: 5,
            padding: 5,
            marginLeft: tipounidade != 4 ? 0 : 5,
            marginRight: 0,
          }}
          id="inputNome"
        >
          {nomepaciente}
        </button>
        <button
          className="blue-button"
          style={{
            backgroundColor: '#279AB1',
            color: '#FFFFFF',
            textTransform: 'uppercase',
            margin: 5,
            padding: 5,
            width: window.innerWidth > 800 ? 150 : 0.1 * window.innerWidth,
          }}
          id="inputDn"
          title="IDADE."
        >
          {moment().diff(moment(dn, 'DD/MM/YYYY'), 'years') + ' ANOS'}
        </button>
      </div>
    );
  }

  // definindo as cores dos bot??es das prescri????es, conforme a sele????o.
  const setActive = (item) => {
    var botoes = document.getElementById("LISTA DE PRESCRI????ES").getElementsByClassName("red-button");
    for (var i = 0; i < botoes.length; i++) {
      botoes.item(i).className = "blue-button";
    }
    document.getElementById("btnprescricao" + item.id).className = "red-button";
  }

  // exibi????o da lista de prescri????es.
  const ShowPrescricoes = useCallback(() => {
    return (
      <div
        className="scroll"
        id="LISTA DE PRESCRI????ES"
        style={{
          display: stateprontuario == 9 ? 'flex' : 'none',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          width: '18vw',
          height: '75vh',
          margin: 0, marginLeft: 10,
          padding: 5,
        }}
      >
        {listprescricoes.map((item) => (
          <div
            key={item.id}
            id="prescri????o"
            className="row prescricao"
            style={{
              display: item.status !== 2 ? 'flex' : 'none',
              margin: 2.5,
              flexDirection: 'column',
              opacity: 1,
              boxShadow: 'none',
              backgroundColor: 'transparent',
            }}
            onClick={() => {
              selectPrescricao(item);
              setActive(item);
            }}
          >
            <div
              style={{
                display: 'flex', flexDirection: 'row', justifyContent: 'center', margin: 2.5,
                padding: 2.5, paddingLeft: 0, paddingRight: 10
              }}>
              <button
                id={"btnprescricao" + item.id}
                className="blue-button"
                style={{
                  width: '100%',
                  padding: 5,
                  flexDirection: 'column',
                  backgroundColor: item.id == idprescricao ? "#ec7063" : "8f9bbc",
                }}
              >
                <div>{moment(item.data).format('DD/MM/YY')}</div>
                <div>{moment(item.data).format('HH:mm')}</div>
                <div>{item.idprofissional}</div>
                <div>{'CONSELHO'}</div>
              </button>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <button id={"deleteprescricao" + item.id}
                  className="animated-red-button"
                  onClick={() => deletePrescription(item)}
                  style={{
                    marginRight: 0,
                    display: item.status == 0 ? 'flex' : 'none',
                  }}
                  title='EXCLUIR PRESCRI????O'
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
                <button id={"copyprescricao" + item.id}
                  className="animated-green-button"
                  onClick={() => {
                    document.getElementById("btnprescricao" + item.id).className = "blue-button";
                    copyPrescription(item);
                  }}
                  style={{ marginRight: 0, display: item.status == 0 ? 'none' : 'flex' }}
                  title="COPIAR PRESCRI????O."
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
                <button id={"signprescricao" + item.id}
                  className="animated-green-button"
                  onClick={() => signPrescription(item)}
                  style={{ marginRight: 0, display: item.status == 0 ? 'flex' : 'none' }}
                  title="SALVAR PRESCRI????O."
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
                  id={"printprescricao" + item.id}
                  className="animated-green-button"
                  onClick={() => viewPrintPrescricao(item)}
                  style={{ marginRight: 0, display: item.status == 1 && item.usuario == nomeusuario ? 'flex' : 'none' }}
                  title="IMPRIMIR PRESCRI????O."
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
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }, [stateprontuario, listprescricoes]
  );

  // filtro para busca de itens de prescri????o.
  function SearchItensPrescription() {
    return (
      <input
        className="input"
        autoComplete="off"
        placeholder="PROCURAR..."
        onFocus={(e) => (e.target.placeholder = '')}
        onBlur={(e) => (e.target.placeholder = "PROCURAR...")}
        onChange={() => filterItemPrescricao()}
        // disabled={listprescricoes.length > 0 && idprescricao != '' ? false : true}
        style={{
          display: stateprontuario == 9 ? 'flex' : 'none',
          opacity: idprescricao !== '' ? 1 : 0.3,
          width: '55vw',
          zIndex: 3,
        }}
        type="text"
        id="inputFilterItemPrescricao"
        defaultValue={filteritemprescricao}
        maxLength={100}
      ></input>
    )
  }

  // cabe??alho da lista de itens prescritos.
  function CabecalhoPrescricao() {
    return (
      <div className="scrollheader" style={{ marginTop: 5 }}>
        <div className="rowheader" style={{
          display: stateprontuario == 9 ? 'flex' : 'none',
          paddingRight: 15, marginBottom: -5, marginTop: -5
        }}>
          < div className="header-button" style={{
            width: '100%', margin: 2.5
          }
          }> F??RMACO</div >
          <div className="header-button" style={{ minWidth: 50, margin: 2.5 }}>QTDE</div>
          <div className="header-button" style={{ minWidth: 120, margin: 2.5 }}>HOR??RIO</div>
        </div>
      </div>
    )
  }

  // lista de itens de uma prescri????o.
  function ItensPrescricao() {
    return (
      <div
        className="scroll"
        id="LISTA DE ITENS PRESCRITOS"

        /*
        onMouseUp={() => scrollPosition()}
        onMouseOver={() => keepScroll()}
        
        onClick={() => keepScroll()}
        onLoad={() => keepScroll()}
        */

        style={{
          display: stateprontuario == 9 ? 'flex' : 'none',
          height: 'calc(65vh - 22px)', width: '100%', alignItems: 'center',
          marginLeft: 10,
          backgroundColor: '#f8f9f9',
          borderColor: 'f8f9f9',
          scrollBehavior: 'smooth',
          // borderTopRightRadius: 0, borderBottomRightRadius: 0
        }}
      >
        {arrayitemprescricao.map((item) => (
          <div
            key={item.id}
            id={"item da prescri????o" + item.id}
            // disabled={item.status === 1 || statusprescricao === 1 ? true : false}
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              opacity: item.status === 1 ? 0.3 : 1,
              width: '100%',
              padding: 5,
            }}
          >
            <button id={"button_item_retract" + item.id}
              className="grey-button"
              style={{
                display: 'none',
                position: "absolute", top: 10, left: 10,
                width: 20, minWidth: 20, height: 20, minHeight: 20
              }}
              onClick={() => unSelectItem()}
            >
              {"-"}
            </button>
            <button id={"button_item_expand" + item.id}
              className="grey-button"
              style={{
                display: 'flex',
                position: "absolute", top: 10, left: 10,
                width: 20, minWidth: 20, height: 20, minHeight: 20
              }}
              onClick={() => selectItem(item)}
            >
              +
            </button>
            <div
              style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
              <div
                className="blue-button"
                // onClick={() => selectItem(item)}
                // disabled={item.status === 1 || statusprescricao === 1 ? true : false}
                id={item.id}
                style={{
                  width: '100%',
                  margin: 2.5,
                  paddingRight: 10,
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  backgroundColor: '#8f9bbc',
                }}
              >
                <div
                  style={{
                    display: window.innerWidth > 1024 ? 'flex' : 'none',
                    flexDirection: 'column',
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    padding: 10,
                    width: '100%',
                  }}
                >
                  <div id="nome do item"
                    className='row'
                    style={{
                      backgroundColor: 'transparent',
                      boxShadow: 'none',
                      minHeight: 70,
                      display: 'flex',
                      flexDirection: 'row',
                      verticalAlign: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                    }}>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', width: '100%' }}>
                      <text className="title5" style={{ color: 'white' }}>
                        {JSON.stringify(item.nome_item).length > 45 ? JSON.stringify(item.nome_item).substring(1, 45) + '...' : item.nome_item}
                      </text>
                    </div>
                    <button id="deletar item"
                      className="animated-red-button"
                      onClick={() => deleteItem(item)}
                      // disabled={item.status === 1 || statusprescricao === 1 ? true : false}
                      style={{
                        // display: statusprescricao === 0 ? 'flex' : 'none',
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

                  <div id="cabe??alho de a????es massivas"
                    style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                    <div className="header-button" style={{ minWidth: 50, margin: 2.5, color: 'white', marginBottom: 0 }}>QTDE</div>
                    <div className="header-button" style={{ minWidth: 120, margin: 2.5, color: 'white', marginBottom: 0 }}>VIA</div>
                    <div className="header-button" style={{ minWidth: 120, margin: 2.5, color: 'white', marginBottom: 0 }}>HOR??RIO</div>
                  </div>
                  <div id="inputs para a????es massivas"
                    // bot??es para a????o coletiva referente ao tipo de item prescrito (excluir todos, mudar quantidade, via e aprazamento de todos, etc.).
                    style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}
                  >
                    <input id="inputQtde(massivo)"
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        clearTimeout(timeout);
                        timeout = setTimeout(() => {
                          var quantidade = document.getElementById("inputQtde(massivo)").value;
                          updateMassiveItensPrescricao(item, quantidade, item.via, item.aprazamento, item.observacao, item.justificativa);
                          e.stopPropagation();
                        }, 2000);
                      }}
                      className="input"
                      // disabled={item.status === 1 || statusprescricao === 1 ? true : false}
                      defaultValue={item.qtde}
                      autoComplete="off"
                      placeholder="QTDE."
                      onFocus={(e) => (e.target.placeholder = '')}
                      onBlur={(e) => (e.target.placeholder = 'QTDE.')}
                      title="QUANTIDADE (ITEM)."
                      style={{
                        display: 'flex',
                        width: 50,
                        margin: 2.5,
                        flexDirection: 'column',
                        boxShadow: '0px 1px 5px 1px rgba(0, 0, 0, 0.1)',
                        color: '#8f9bbc'
                      }}
                      type="number"
                      maxLength={3}>
                    </input>
                    <button id="seletor via (massivo)"
                      className="hover-button"
                      onClick={(e) => { setshowitemviaselector(1); e.stopPropagation() }}
                      style={{
                        display: 'flex',
                        width: 120,
                        minWidth: 120,
                        maxWidth: 120,
                        padding: 5,
                        margin: 2.5,
                        flexDirection: 'column',
                      }}
                    >
                      {item.via}
                    </button>
                    <button id="seletor aprazamento (massivo)"
                      className="hover-button"
                      onClick={(e) => { setshowitemhorarioselector(1); e.stopPropagation() }}
                      style={{
                        width: 120,
                        minWidth: 120,
                        maxWidth: 120,
                        margin: 2.5,
                        flexDirection: 'column',
                        //opacity: item.id === iditem ? 1 : 0.6,
                      }}
                    >
                      <div>{item.aprazamento}</div>
                    </button>
                  </div>

                  <div id="seletor de via de administra????o"
                    className="menucover"
                    style={{
                      display: showitemviaselector == 1 ? 'flex' : 'none',
                      zIndex: 9, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
                    }}
                    onClick={() => { setshowitemviaselector(0) }}
                  >
                    <div className="menucontainer" style={{ padding: 10 }}>
                      <div className="title2">VIA DE ADMINISTRA????O</div>
                      <div
                        className="scroll"
                        id="LISTA DE VIAS DE ADMINISTRA????O DO ITEM DA PRESCRI????O"
                        style={{
                          height: 250,
                        }}
                      >
                        {arrayitemvia.map((valor) => (
                          <div
                            key={valor.id}
                            onClick={(e) => {
                              updateMassiveItensPrescricao(item, item.qtde, valor, item.aprazamento, item.observacao, item.justificativa);
                              setvia(valor);
                              setshowitemviaselector(0);
                              e.stopPropagation();
                            }}
                            id="item da lista"
                            className="blue-button"
                            style={{ width: 200 }}
                          >
                            {valor}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div id="seletor do aprazamento para administra????o"
                    className="menucover"
                    style={{
                      display: showitemhorarioselector == 1 ? 'flex' : 'none',
                      zIndex: 9, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
                    }}
                    onClick={() => setshowitemhorarioselector(0)}
                  >
                    <div className="menucontainer" style={{ padding: 10 }}>
                      <div className="title2">HOR??RIOS DE ADMINISTRA????O</div>
                      <div
                        className="scroll"
                        id="LISTA DE HOR??RIOS PARA ADMINISTRA????O DO ITEM DA PRESCRI????O"
                        style={{
                          justifyContent: 'flex-start',
                          margin: 5,
                          marginTop: 5,
                          padding: 0,
                          paddingRight: 5,
                          height: 250,
                        }}
                      >
                        {arrayitemhorario.map((valor) => (
                          <div
                            key={valor.id}
                            onClick={(e) => {
                              updateMassiveItensPrescricao(item, item.qtde, item.via, valor, item.observacao, item.justificativa);
                              setaprazamento(valor);
                              setshowitemhorarioselector(0);
                              e.stopPropagation();
                            }}
                            id="item da lista"
                            className="blue-button"
                            style={{ width: 200 }}
                          >
                            {valor}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div id={"itens prescritos" + item.iditem}
                className="retractitensprescricao"
                style={{ flexDirection: 'column', justifyContent: 'center' }}
              >
                {listitensprescricao.filter(valor => valor.iditem == item.iditem).map(valor => (
                  <div id={"itemrow" + valor.id}
                    className="row"
                    // onMouseOver={() => document.getElementById("itemrow" + valor.id).className = "row"}
                    // onMouseOut={() => document.getElementById("itemrow" + valor.id).className = "rowstop"}
                    style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                    <input id={"inputQtde" + valor.id}
                      className="input"
                      // disabled={item.status === 1 || statusprescricao === 1 ? true : false}
                      defaultValue={valor.qtde}
                      autoComplete="off"
                      placeholder="QTDE."
                      onFocus={(e) => (e.target.placeholder = '')}
                      onBlur={(e) => (e.target.placeholder = 'QTDE.')}
                      title="QUANTIDADE (ITEM)."
                      style={{
                        display: 'flex',
                        width: 50,
                        margin: 2.5,
                        flexDirection: 'column',
                        boxShadow: '0px 1px 5px 1px rgba(0, 0, 0, 0.1)',
                      }}
                      onKeyUp={(e) => {
                        clearTimeout(timeout);
                        timeout = setTimeout(() => {
                          var quantidade = document.getElementById("inputQtde" + valor.id).value;
                          updateItemQtde(quantidade, valor);
                          e.stopPropagation();
                        }, 2000);
                      }}
                      type="number"
                      maxLength={3}>
                    </input>
                    <button id={"aprazamento" + valor.id}
                      className="hover-button"
                      // disabled={item.status === 1 || statusprescricao === 1 ? true : false}
                      onClick={() => setshowitemhorarioselector(2)}
                      style={{
                        width: 120,
                        minWidth: 120,
                        maxWidth: 120,
                        margin: 2.5,
                        flexDirection: 'column',
                        //opacity: item.id === iditem ? 1 : 0.6,
                      }}
                    >
                      <div>{moment(valor.horario).format('DD/MM/YY - HH:mm')}</div>
                    </button>
                    <div id="seletor de hor??rios para item (n??o massivo)"
                      className="menucover"
                      style={{
                        zIndex: 999,
                        display: showitemhorarioselector == 2 ? 'flex' : 'none',
                        flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
                      }}
                      onClick={() => { setshowitemhorarioselector(0) }}
                    >
                      <div className="menucontainer" style={{ padding: 10 }}>
                        <div className="title2">HOR??RIOS DE ADMINISTRA????O</div>
                        <div
                          className="scroll"
                          id="LISTA DE HOR??RIOS PARA ADMINISTRA????O DO ITEM DA PRESCRI????O"
                          style={{
                            justifyContent: 'flex-start',
                            flexWrap: 'wrap',
                            flexDirection: 'row',
                            margin: 5,
                            marginTop: 5,
                            padding: 0,
                            paddingRight: 5,
                            height: '60vh',
                            width: '60vw',
                          }}
                        >
                          {arrayclock.map((aprazamento) => (
                            <div
                              key={aprazamento.id}
                              onClick={() => updateItemAprazamento(valor, aprazamento)}
                              id="item da lista"
                              className="blue-button"
                              style={{ width: 200, height: 75 }}
                            >
                              {aprazamento}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button id="deletar item"
                      className="animated-red-button"
                      onClick={() => deleteItem(valor)}
                      // disabled={item.status === 1 || statusprescricao === 1 ? true : false}
                      style={{
                        // display: statusprescricao === 0 ? 'flex' : 'none',
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
                ))}
              </div>
            </div>

            <div id={"observa????es e componentes" + item.iditem}
              className="retractitensprescricao"
              style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="title2" style={{ fontSize: 14 }}>OBSERVA????ES</div>
                <textarea
                  id="inputObservacoes"
                  className="textarea"
                  disabled={item.status === 1 || statusprescricao === 1 ? true : false}
                  defaultValue={item.observacao}
                  onChange={(e) => {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => {
                      var observacao = document.getElementById("inputObservacoes").value;
                      updateMassiveItensPrescricao(item, item.qtde, item.via, item.aprazamento, observacao, item.justificativa);
                      e.stopPropagation();
                    }, 2000);
                  }}
                  style={{
                    margin: 5, padding: 5,
                    width: 250,
                    height: 185,
                    justifyContent: 'flex-start',
                    boxShadow: '0px 1px 5px 1px rgba(0, 0, 0, 0.1)',
                  }}
                >
                </textarea>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', width: '100%', paddingRight: 10 }}>
                <div className="title2" style={{ fontSize: 14 }}>COMPONENTES</div>
                <div
                  className="scroll"
                  // disabled={item.status === 1 || statusprescricao === 1 ? true : false}
                  id="LISTA DE COMPONENTES"
                  style={{
                    margin: 5, padding: 5,
                    width: '100%',
                    height: 185,
                    boxShadow: '0px 1px 5px 1px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  {listcomponentes.filter(valor => valor.iditemprescricao == item.id).map((value) => (
                    <div
                      key={value.id}
                      id="componente do item da prescri????o"
                      className="row"
                      style={{ margin: 2.5, justifyContent: 'space-between', boxShadow: '0px 1px 5px 1px rgba(0, 0, 0, 0.1)' }}>
                      <div className="title2" style={{ width: '100%', justifyContent: 'left', alignSelf: 'center' }}>{value.componente}</div>
                      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                        <input
                          id={"inputqtdecomponente" + value.id}
                          className="input"
                          // disabled={item.status === 1 ? true : false}
                          autoComplete="off"
                          placeholder="QTDE."
                          onFocus={(e) => (e.target.placeholder = '')}
                          onBlur={(e) => (e.target.placeholder = 'QTDE')}
                          onChange={(e) => {
                            clearTimeout(timeout);
                            timeout = setTimeout(() => {
                              var quantidade = document.getElementById("inputqtdecomponente" + value.id).value;
                              alert('QTDE: ' + quantidade + 'ID: ' + value.id);
                              updateComponent(quantidade, value);
                              e.stopPropagation();
                            }, 2000);
                          }}
                          style={{
                            display: 'flex',
                            width: 50,
                            margin: 2.5,
                            flexDirection: 'column',
                            boxShadow: '0px 1px 5px 1px rgba(0, 0, 0, 0.3)',
                          }}
                          defaultValue={value.qtde}
                          type="number"
                          title="QUANTIDADE (COMPONENTE)."
                          maxLength={3}>
                        </input>
                        <button className="animated-red-button"
                          onClick={() => deleteComponent(value)}
                          // disabled={value.status === 1 ? true : false}
                          style={{ marginRight: 0 }}
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
                  ))}
                  <button id="bot??o para inserir componente" className="green-button"
                    // disabled={item.status === 1 ? true : false}
                    style={{ display: 'flex', alignSelf: 'flex-end', width: 50, marginTop: 6, marginRight: 5 }}
                  >
                    <img
                      alt=""
                      src={novo}
                      onClick={() => viewInsertComponente(item.rows)}
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
                display: expanditem === 1 && item.id === iditem && item.grupo === 'ANTIBIOTICOS' ? 'flex' : 'none',
                flexDirection: 'row',
                justifyContent: 'center',
                width: '100%'
              }}>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '100%', padding: 2.5, paddingTop: 0 }}>
                <div className="title2" style={{ fontSize: 14 }}>JUSTIFICATIVA</div>
                <textarea
                  id="inputJustificativa"
                  className="textarea"
                  disabled={item.status === 1 || statusprescricao === 1 ? true : false}
                  defaultValue={item.justificativa}
                  onKeyUp={(e) => updateJustificativa(e.target.value, item)}
                  style={{
                    margin: 5,
                    padding: 5,
                    width: '100%',
                    // width: '0.3 * (window.innerWidth)',
                    height: 100,
                    margin: 2.5,
                    justifyContent: 'flex-start',
                    boxShadow: '0px 1px 5px 1px rgba(0, 0, 0, 0.1)',
                  }}
                >
                </textarea>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', margin: 5, marginTop: 0, width: 350 }}>
                  <div id="INICIO" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                    <div className="title2" style={{ fontSize: 14 }}>IN??CIO</div>
                    <MaskedInput
                      className="input"
                      disabled={item.status === 1 ? true : false}
                      autoComplete="off"
                      placeholder="?"
                      value={item.datainicio}
                      onFocus={(e) => (e.target.placeholder = '')}
                      onBlur={(e) => (e.target.placeholder = '?')}
                      onKeyUp={(e) => updateDataInicio(e.target.value, item)}
                      mask="11/11/11"
                      style={{
                        width: 100,
                        margin: 2.5,
                        flexDirection: 'column',
                        boxShadow: '0px 1px 5px 1px rgba(0, 0, 0, 0.1)',
                      }}
                      id="inputDataInicio"
                      title="DIA DE IN??CIO DO ANTIBI??TICO."
                    >
                    </MaskedInput>
                  </div>
                  <div id="DIAS DE USO" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                    <div className="title2" style={{ fontSize: 14, alignSelf: 'center' }}>DIAS DE USO</div>
                    <input
                      className="input"
                      disabled={item.status === 1 ? true : false}
                      autoComplete="off"
                      placeholder="?"
                      onFocus={(e) => (e.target.placeholder = '')}
                      onBlur={(e) => (e.target.placeholder = '?')}
                      onKeyUp={(e) => updateDataTermino(e.target.value, item)}
                      style={{
                        alignSelf: 'center',
                        width: 50,
                        margin: 2.5,
                        boxShadow: '0px 1px 5px 1px rgba(0, 0, 0, 0.1)',
                      }}
                      defaultValue={item.datatermino === '' ? '?' : moment(item.datatermino, 'DD/MM/YY').diff(moment(item.datainicio, 'DD/MMYY'), 'days')}
                      type="number"
                      id="inputDiasAtb"
                      title="DIAS DE USO DO ANTIBI??TICO."
                      maxLength={2}>
                    </input>
                  </div>
                  <div id="T??RMINO" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                    <div className="title2" style={{ fontSize: 14 }}>T??RMINO</div>
                    <button
                      className={moment(item.datatermino, 'DD/MM/YY').diff(moment(), 'days') < 1 || item.datatermino === '' ? "red-button" : "green-button"}
                      disabled={true}
                      value={item.datatermino}
                      style={{
                        width: 100,
                        boxShadow: '0px 1px 5px 1px rgba(0, 0, 0, 0.1)',
                      }}
                      id="inputDataInicio"
                      title="DIA DE T??RMINO DO ANTIBI??TICO."
                    >
                      {item.datatermino === '' ? '?' : item.datatermino}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="title2"
          style={{
            color: '#ec7063',
            fontSize: 14,
            fontWeight: 'bold',
            margin: 5,
            marginTop: 10
          }}>
          {arrayoptionsitens.length === 1 && arrayitemprescricao.length > 0 && statusprescricao === 0 ? 'REPETIR ITEM...' :
            arrayoptionsitens.length > 0 && arrayitemprescricao.length > 0 && statusprescricao === 0 ? 'INSERIR ITEM...' :
              arrayoptionsitens.length > 0 && arrayitemprescricao.length < 1 && statusprescricao === 0 ? 'INSERIR ITEM...' : ''}
        </div>
        {arrayoptionsitens.map((item) => (
          <p id="LISTA DE OP????ES DE ITENS">
            <button className="green-button"
              onClick={() => insertItem(item)}
              style={{
                // display: statusprescricao === 0 ? 'flex' : 'none',
                display: 'flex',
                alignSelf: 'flex-end',
                width: 300,
                margin: 5,
                marginLeft: 0
              }}
            >
              {item.ds_produto}
            </button>
          </p>
        ))}
      </div>
    )
  };

  // fun????o que seleciona uma prescri????o.
  const selectPrescricao = (item) => {
    setexpanditem(0);
    setfilteritemprescricao('');
    loadItensPrescricoes(item.id);
    // loadAntibioticos();
    // getHorarios();
    setdataprescricao(item.data);
    setstatusprescricao(item.status);
    setidprescricao(item.id);
    console.log(idprescricao);
  }

  // carregamento de todos os itens prescritos para o atendimento. Importante para itens de antibi??ticos (todas as prescri????es).
  const [listantibioticos, setlistantibioticos] = useState([]);
  const loadAntibioticos = () => {
    axios.get(htmlitensatendimento + idatendimento).then((response) => {
      var x = [0, 1];
      x = response.data;
      setlistantibioticos(x.rows);
    });
  }

  // carregando os itens de uma prescri????o selecionada.
  const [minimalarrayitensprescricao, setminimalarrayitensprescricao] = useState([])
  const loadItensPrescricoes = (id, filteritemprescricao) => { // id da prescri????o, filtro de item da prescri????o.
    document.getElementById("LISTA DE ITENS PRESCRITOS").style.cursor = "progress";
    axios.get(htmlitensprescricao + id).then((response) => {
      var x = [0, 1];
      x = response.data;
      var y = [0, 1];
      y = x.rows;
      // excluindo repeti????es da array de itens para a confe????o do "cabe??alho" de item prescrito.
      var arr = y.filter((value, index, self) =>
        index === self.findIndex((item) => (
          item.nome_item === value.nome_item
        ))
      )
      setTimeout(() => {
        setlistitensprescricao(x.rows);
        setarrayitemprescricao(arr);
        loadComponents(id);
        document.getElementById("LISTA DE ITENS PRESCRITOS").style.cursor = "pointer";
      }, 1000);
      if (filteritemprescricao == '') {
        setarrayitemprescricao(arr);
        setarrayoptionsitens([]);
      } else {
        setarrayitemprescricao(arr.filter(item => item.nome_item.includes(filteritemprescricao) == true));
        setarrayoptionsitens(optionsitens.filter(item => item.ds_produto.includes(filteritemprescricao) == true));
      }
      // loadViewComponents();
    });
  }
  // carregamento usado para atualiza????o dos itens de prescri????o.
  const loadItensPrescricoesById = (idprescricao, iditem) => {
    axios.get(html + "/itensprescricao/'" + idprescricao + "'").then((response) => {
      var x = [0, 1];
      x = response.data;
      setlistitensprescricao(response.data);
      if (expanditem === 1) {
        setarrayitemprescricao(x.filter(value => value.id === iditem));
      } else {
        setarrayitemprescricao(x);
      }
      loadComponents();
      // loadViewComponents();
    });
  }
  // sele????o do item de prescri????o.
  const [expanditem, setexpanditem] = useState(0);
  const [itemtodo, setitemtodo] = useState([]);
  const selectItem = (item) => {
    // atualizando os estados referentes ao item.
    setid(item.id);
    setiditem(item.iditem);
    setnome_item(item.nome_item);
    setkeyword_item(item.keyword_item);
    setqtde(item.qtde);
    setvia(item.via);
    sethorario(item.horario);
    setobservacao(item.observacao);
    setstatus(item.status);
    setjustificativa(item.justificativa);
    settipoitem(item.tipoitem);
    setaprazamento(item.aprazamento);
    settag_componente(item.tag_componente);
    // filtrando array de itens prescritos para que apenas o item em destaque seja exibido.
    var arr = listitensprescricao.filter((value, index, self) =>
      index === self.findIndex((item) => (
        item.nome_item === value.nome_item
      ))
    )
    setarrayitemprescricao(arr.filter(value => value.iditem == item.iditem));
    // expande a view contendo os registros de itens (aprazamentos).
    setTimeout(() => {
      document.getElementById("itens prescritos" + item.iditem).classList.toggle("expanditensprescricao");
      document.getElementById("observa????es e componentes" + item.iditem).classList.toggle("expanditensprescricao");
      // document.getElementById("LISTA DE ITENS PRESCRITOS").scrollTo(0, document.getElementById("item da prescri????o" + item.id).offsetTop - 200);
      document.getElementById("button_item_retract" + item.id).style.display = 'flex';
      document.getElementById("button_item_expand" + item.id).style.display = 'none';
    }, 500);
  }

  function unSelectItem() {
    loadItensPrescricoes(idprescricao, '');
    setTimeout(() => {
      document.getElementById("LISTA DE ITENS PRESCRITOS").style.cursor = "pointer";
      document.getElementById("LISTA DE ITENS PRESCRITOS").scrollTo(0, document.getElementById("item da prescri????o" + id).offsetTop - 200);
    }, 3000);
  }

  // deletando item da prescri????o.
  const deleteItem = (item) => {
    // excluindo PRIMEIRO os registros de componentes. 
    listcomponentes.filter(value => value.iditem == item.iditem).map(item => {
      axios.get(htmldeletecomponenteprescricaopontual + item.id);
    })
    // excluindo registro de item.
    var countlenght = listitensprescricao.filter(valor => valor.iditem == item.iditem).lenght;
    listitensprescricao.filter(valor => valor.iditem == item.iditem).map(valor => {
      axios.get(htmldeleteitemprescricao + valor.id).then(() => {
        countlenght = countlenght - 1;
        if (countlenght == 0) {
          loadItensPrescricoes(idprescricao, '');
        }
      });
    })
  }

  // suspendendo item da prescri????o.
  const suspendItem = (item) => {
    var obj = {
      idpct: idpaciente,
      idatendimento: idatendimento,
      idprescricao: idprescricao,
      iditem: item.cd_produto,
      nome_item: item.ds_produto,
      keyword_item: item.ds_produto_resumido,
      qtde: parseInt(item.qtde),
      via: item.via,
      horario: item.horario,
      observacao: item.observacao,
      status: 0,
      justificativa: '-x-',
      datainicio: item.datainicio,
      datatermino: moment(),
      tipoitem: parseInt(item.tipo),
      aprazamento: item.horario,
      tag_componente: item.tag_componente,
    };
    axios.post(htmlupdateitemprescricao + item.id, obj);
  }

  // deletando os resgistros de checagem referentes ao item selecionado.
  const deleteCheck = (item) => {
    axios.get(html + "/deletechecagemprescricao/" + item.iditem);
  }
  // deletando os resgistros de componentes referentes ao item selecionado.
  const deleteComponents = (item) => {
    axios.get(html + "/deletecomponenteprescricao/" + item.iditem);
  }

  // prescri????es valem das 13h do dia da prescri????o ??s 13h do dia seguinte.
  const insertItem = (item) => {
    if (item.horario == '24/24H') {
      pushItem(item, moment().startOf('day').add(1, 'day').add(10, 'hours')); // padr??o 10h do dia seguinte ?? prescri????o.
      setTimeout(() => {
        pushComponente(1, item.tag_componente, item.cd_produto);
      }, 2000);
    } else if (item.horario == '12/12H') {
      var rounds = 2;
      var horas = 8;
      for (var i = 0; i < rounds; i++) { // 20h e 8h do dia seguinte.
        horas = horas + 12;
        pushItem(item, moment().startOf('day').add(horas, 'hours'));
      }
      setTimeout(() => {
        pushComponente(2, item.tag_componente, item.cd_produto);
      }, 2000);
    } else if (item.horario == '6/6H') { // 18h, contando 6h a partir.
      var rounds = 4;
      var horas = 12;
      for (var i = 0; i < rounds; i++) {
        horas = horas + 6;
        pushItem(item, moment().startOf('day').add(horas, 'hours'));
      }
      setTimeout(() => {
        pushComponente(4, item.tag_componente, item.cd_produto);
      }, 2000);
    }
    setTimeout(() => {
      loadItensPrescricoes(idprescricao, '');
    }, 3000);
  }

  // inserindo item na prescri????o.
  const pushItem = (item, horario) => {
    var obj = {
      idpct: idpaciente,
      idatendimento: idatendimento,
      idprescricao: idprescricao,
      iditem: item.cd_produto,
      nome_item: item.ds_produto,
      keyword_item: item.ds_produto_resumido,
      qtde: parseInt(item.qtde),
      via: item.via,
      horario: horario,
      observacao: item.observacao,
      status: 0,
      justificativa: '-x-',
      datainicio: moment(),
      datatermino: moment().add(1, 'day'),
      tipoitem: parseInt(item.tipo),
      aprazamento: item.horario,
      tag_componente: item.tag_componente,
    };
    axios.post(htmlinsertitemprescricao, obj);
  }

  // inserindo componentes no item prescrito.
  const pushComponente = (rounds, tag, iditem) => {
    // recuperar id do item rec??m-criado:
    axios.get(htmlitensprescricao + idprescricao).then((response) => {
      var x = [0, 1];
      var y = [0, 1];
      var ids = [0, 1];
      x = response.data;
      y = x.rows;
      var ids = y.map(item => item.id).slice(y.length - rounds, y.length);
      alert(y.map(item => item.id).slice(y.length - rounds, y.length));
      for (var i = 0; i < rounds; i++) {
        var id = ids.pop(-1);
        alert(id);
        optionscomponentes.filter(value => value.tag_componente == tag).map(item => {
          var obj = {
            idpct: idpaciente,
            idatendimento: idatendimento,
            idprescricao: idprescricao,
            iditemprescricao: id,
            componente: item.ds_produto,
            qtde: item.qtde,
            iditem: iditem,
          }
          axios.post(htmlinsertcomponenteprescricao, obj);
          //alert(JSON.stringify(obj));
        });
      }
    });
  }

  // inserindo prescri????o.
  const insertPrescription = () => {
    // criando um novo registro de prescri????o.
    setviewselectmodelprescription(0);
    var obj = {
      idpct: idpaciente,
      idatendimento: idatendimento,
      data: moment(),
      status: 0,
      idprofissional: 0,
    };
    axios.post(htmlinsertprescricao, obj).then(() => {
      // resgatando o id da prescri????o gerada.
      axios.get(htmlprescricoes + idatendimento).then((response) => {
        var x = [0, 1];
        var y = [0, 1];
        x = response.data;
        y = x.rows;
        const lastid = y.map((item) => item.id).slice(-1);
        lastidprescricao = lastid;
        loadPrescricoes();
        setidprescricao(lastid);
        loadItensPrescricoes(filteritemprescricao);
      });
    });
  }
  // deletando prescri????o.
  const deletePrescription = (item) => {
    setfilteritemprescricao('');
    // deletando a identifica????o da prescri????o em sua lista.
    axios.get(htmldeleteprescricao + item.id);
    // deletando os registros de itens associados ?? prescri????o.

    /*
    axios.get(html + "/deleteallitemprescricao/" + item.id);
    // deletando os registros de componentes associados ?? prescri????o.
    axios.get(html + "/deleteallcomponenteprescricao/" + item.id);
    // deletando os registros de checagens associados ?? prescri????o.
    axios.get(html + "/deleteallchecagemprescricao/" + item.id);
    // deletando os registros de views dos componentes.
    axios.get(html + "/deletefullcomponenteview/" + item.id);
    */
    // limpando a lista de itens.
    setarrayitemprescricao([]);
    setTimeout(() => {
      loadPrescricoes();
      setlistitensprescricao([]);
      setarrayitemprescricao([]);
      setlistcomponentes([]);
      setidprescricao('');
    }, 1000);
  }

  // exibindo o componente de hemoderivados.
  const loadHemoderivados = () => {
    sethemoderivados(1);
    setviewselectmodelprescription(0);
    setpickdate1('N??O');
  }

  // copiando modelos de prescri????o.
  // prescri????o ENFERMARIA.
  const loadPrescricaoEnfermaria = () => {
    setviewselectmodelprescription(0);
    // criando um novo registro de prescri????o.
    var obj = {
      idatendimento: idatendimento,
      data: moment().format('DD/MM/YY HH:mm'),
      usuario: nomeusuario,
      conselho: especialidadeusuario,
      status: 0,
    };
    axios.post(html + '/insertprescricao', obj).then(() => {
      loadPrescricoes();
      // resgatando o id da prescri????o gerada.
      axios.get(html + "/lastprescricao/" + idatendimento).then((response) => {
        var x = [0, 1];
        x = response.data;
        const arraylastid = x.map((item) => item.id);
        const lastid = arraylastid[0];
        lastidprescricao = lastid;
        setidprescricao(lastid);
      });
      // mapeando e copiando os itens da prescri????o predefinida.
      axios.get(html + "/prescricaoenfermaria").then((response) => {
        var x = [0, 1];
        x = response.data;
        x.map((item) => copyItem(item));
        setTimeout(() => {
          loadItensPrescricoes('');
        }, 3000);
      });
    });
  }

  // componente para sele????o de PRESCRI????ES PREDEFINIDAS.
  function SelectModelPrescricao() {
    if (viewselectmodelprescription == 1) {
      return (
        <div className="menucover" onClick={(e) => { setviewselectmodelprescription(0); e.stopPropagation() }} style={{ zIndex: 9, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div className="menucontainer" style={{ padding: 20 }}>
            <div className="title2" style={{ fontSize: 16 }}>MODELOS DE PRESCRI????O</div>
            <button
              onClick={(e) => { insertPrescription(); e.stopPropagation() }}
              className="blue-button"
              style={{
                width: '100%',
                margin: 5,
                padding: 5,
                flexDirection: 'column',
              }}
            >
              EM BRANCO
            </button>
            <button
              onClick={(e) => { loadPrescricaoEnfermaria(); e.stopPropagation() }}
              className="blue-button"
              style={{
                width: '100%',
                margin: 5,
                padding: 5,
                flexDirection: 'column',
              }}
            >
              ENFERMARIA
            </button>
            <button
              onClick={(e) => { loadHemoderivados(); e.stopPropagation() }}
              className="red-button"
              style={{
                width: '100%',
                margin: 5,
                padding: 5,
                flexDirection: 'column',
              }}
            >
              HEMODERIVADOS
            </button>
          </div>
        </div>
      )
    } else {
      return null;
    }
  }

  // copiando todos os itens de uma prescri????o.
  var lastidprescricao = 0;
  const copyPrescription = (item) => {
    // criando um novo registro de prescri????o.
    var obj = {
      idatendimento: idatendimento,
      data: moment().format('DD/MM/YY HH:mm'),
      usuario: nomeusuario,
      conselho: conselhousuario,
      status: 0,
    };
    axios.post(html + '/insertprescricao', obj).then(() => {
      loadPrescricoes();
      // resgatando o id da prescri????o gerada.
      axios.get(html + "/lastprescricao/" + idatendimento).then((response) => {
        var x = [0, 1];
        x = response.data;
        const lastid = x.map((item) => item.id)[0];
        lastidprescricao = lastid;
      });
      /* mapear cada item da prescri????o a ser copiada e inserir na nova
      prescri????o, recebendo-se o valor lastidprescri????o. */
      axios.get(html + "/itensprescricao/'" + idprescricao + "'").then((response) => {
        var x = [0, 1];
        var y = [0, 1];
        x = response.data;
        // antibi??ticos N??O podem ser copiados, por isso ?? utilizado o filtro abaixo.
        y = x.filter((item) => item.grupo !== 'ANTIBIOTICOS').map((item) => copyItem(item));
        setTimeout(() => {
          // ap??s a c??pia dos itens, estes devem receber seus aprazamentos e componentes.

          loadItensPrescricoes('');
          document.getElementById("btnprescricao" + lastidprescricao).className = "red-button"
        }, 3000);
      });
    });
  }
  const copyItem = (item) => {
    var obj = {
      idatendimento: item.idatendimento,
      idprescricao: lastidprescricao, // destina adequadamente os itens para a nova prescri????o.
      codigo: item.codigo,
      grupo: item.grupo,
      farmaco: item.farmaco,
      qtde: item.qtde,
      via: item.via,
      horario: item.horario,
      observacao: item.observacao,
      status: 0,
      justificativa: item.justificativa,
      datainicio: item.datainicio,
      datatermino: item.datatermino,
    };
    axios.post(html + '/insertprescricaoitem', obj);
  }

  // definindo a data exata de salvamento da prescri????o (assinatua digital), incluindo minutos (CHECK PRESCRI????ES).
  const [dataprescricao, setdataprescricao] = useState('');
  // assinando uma prescri????o (alterando seu status para 1, impedindo assim a exclus??o de itens e componentes).
  const [statusprescricao, setstatusprescricao] = useState(0);
  const signPrescription = (item) => {
    setdataprescricao(moment());
    // a condi????o abaixo impede opera????es em prescri????o vazia e a assinatura da prescri????o quando um antibi??tico n??o foi devidamente registrado (datade inicio n??o setada).
    //if (arrayitemprescricao.length > 0 && arrayitemprescricao.filter((item) => item.grupo == 'ANTIBIOTICOS' && item.datatermino == '').length < 1) {
    var obj = {
      idpct: idpaciente,
      idatendimento: idatendimento,
      data: moment(),
      status: 1,
      idprofissional: 0,
    };
    axios.post(htmlupdateprescricao + item.id, obj).then(() => {
      setstatusprescricao(1); // necess??rio para exibir a op????o de suspens??o dos itens.
      loadPrescricoes();
      loadItensPrescricoes(filteritemprescricao);
    });
    //} else {
    //toast(1, '#ec7063', arrayitemprescricao.lenght < 1 ? 'N??O ?? POSS??VEL SALVAR UMA PRESCRI????O VAZIA.' : 'REGISTRO DE ANTIBI??TICO INCOMPLETO.', 3000);
    //}
  }
  const suspendPrescription = (item) => {
    setdataprescricao(moment().format('DD/MM/YY HH:mm')); // impede opera????es em prescri????o vazia.
    if (arrayitemprescricao.length > 0) {
      var obj = {
        idatendimento: idatendimento,
        data: dataprescricao,
        usuario: nomeusuario,
        conselho: conselhousuario,
        status: 2,
      };
      axios.post(html + "/updateprescricao/" + item.id, obj).then(() => {
        setstatusprescricao(1); // necess??rio para exibir a op????o de suspens??o dos itens.
        loadPrescricoes();
        loadItensPrescricoes(filteritemprescricao);
      });
    } else {
      toast(1, '#ec7063', 'N??O ?? POSS??VEL SUSPENDER UMA PRESCRI????O VAZIA.', 3000);
    }
  }

  // fun????o para constru????o dos toasts.
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


  // carregando a lista de vis??o dos componentes para cada item da prescri????o.
  const [listviewcomponentes, setlistviewcomponentes] = useState([]);
  const loadViewComponents = () => {
    axios.get(html + "/loadcomponenteview").then((response) => {
      setlistviewcomponentes(response.data);
    });
  }

  // carregando os componentes de todos os itens da prescri????o.
  const [listcomponentes, setlistcomponentes] = useState([]);
  const loadComponents = (idprescricao) => {
    axios.get(htmlcomponentesprescricao + idprescricao).then((response) => {
      var x = [0, 1]
      var y = [0, 1]
      x = response.data
      y = x.rows
      // excluindo repeti????es da array de compoenentes, para exibi????o na lista de componentes do item prescrito.
      var arr = y.filter((value, index, self) =>
        index === self.findIndex((item) => (
          item.componente === value.componente
        )));
      setTimeout(() => {
        setlistcomponentes(y);
        //alert(JSON.stringify(y));
      }, 2000);
    });
  }
  // filtrando os componentes para cada item da prescri????o.
  function FilterComponents(value) {
    var x = [];
    x = listcomponentes.filter(item => item.iditemprescricao === value);
    return x;
  }
  // fun????es e componentes que tratam da sele????o de um novo componente ao item de prescri????o.
  // abrindo o popup para inser????o de um novo componente.
  const [selecteditem, setselecteditem] = useState([]);
  const viewInsertComponente = (item) => {
    setselecteditem(item);
    loadOptionsComponentes();
    setTimeout(() => {
      setviewinsertcomponent(1);
    }, 2000);
  }

  // filtrando um novo componente para sele????o.
  const [arrayfiltercomponente, setarrayfiltercomponente] = useState(optionscomponentes);
  const [filtercomponente, setfiltercomponente] = useState('');
  var searchcomponente = '';
  var timeout = null;
  const filterComponente = () => {
    clearTimeout(timeout);
    document.getElementById("inputFilterComponente").focus();
    searchcomponente = document.getElementById("inputFilterComponente").value.toUpperCase();
    timeout = setTimeout(() => {
      if (searchcomponente === '') {
        setarrayfiltercomponente([]);
        document.getElementById("inputFilterComponente").value = '';
        document.getElementById("inputFilterComponente").focus();
      } else {
        setfiltercomponente(document.getElementById("inputFilterComponente").value.toUpperCase());
        setarrayfiltercomponente(optionscomponentes.filter(item => item.ds_produto.includes(searchcomponente) == true));
        document.getElementById("inputFilterComponente").value = searchcomponente;
        document.getElementById("inputFilterComponente").focus();
      }
    }, 500);
  }
  // selecionando e inserindo o novo componente (para cada registro de item).
  const getComponent = (componente) => {
    listitensprescricao.filter(valor => valor.iditem == iditem).map(x => {
      var obj = {
        idpct: idpaciente,
        idatendimento: idatendimento,
        idprescricao: idprescricao,
        iditemprescricao: x.id,
        componente: componente.ds_produto,
        qtde: componente.qtde,
        iditem: componente.cd_produto,
      }
      axios.post(htmlinsertcomponenteprescricao, obj).then(() => {
        setviewinsertcomponent(0);
      });
    })
  }

  // atualizando um conjunto de itens comuns de prescri????o.
  const updateMassiveItensPrescricao = (item, qtde, via, aprazamento, observacao, justificativa) => {

    // deletando os registros de componentes de prescri????o.
    axios.get(htmlcomponentesprescricao + idprescricao).then((response) => {
      var x = [0, 1];
      var y = [0, 1];
      x = response.data;
      y = x.rows;
      y.filter(valor => valor.iditem == item.iditem).map(() => {
        axios.get(htmldeletecomponenteprescricao + item.iditem);
      });
    });

    // excluindo registros de itens.
    axios.get(htmlitensprescricao + idprescricao).then((response) => {
      var x = [0, 1];
      var y = [0, 1];
      x = response.data;
      y = x.rows;
      y.filter(value => value.iditem == item.iditem).map(item => {
        axios.get(htmldeleteitemprescricao + item.id);
      });
    });

    // inserindo os registros de itens de prescri????o com os novos par??metros.
    if (aprazamento == '24/24H') {
      pushMassiveItem(item, qtde, via, aprazamento, moment().startOf('day').add(1, 'day').add(10, 'hours'), observacao, justificativa); // padr??o 10h do dia seguinte ?? prescri????o.
      setTimeout(() => {
        pushComponente(1, item.tag_componente, item.iditem);
      }, 2000);
    } else if (aprazamento == '12/12H') {
      var rounds = 2;
      var horas = 8;
      for (var i = 0; i < rounds; i++) { // 20h e 8h do dia seguinte.
        horas = horas + 12;
        pushMassiveItem(item, qtde, via, aprazamento, moment().startOf('day').add(horas, 'hours'), observacao, justificativa);
      }
      setTimeout(() => {
        pushComponente(2, item.tag_componente, item.iditem);
      }, 2000);
    } else if (aprazamento == '6/6H') { // 18h, contando 6h a partir.
      var rounds = 4;
      var horas = 12;
      for (var i = 0; i < rounds; i++) {
        horas = horas + 6;
        pushMassiveItem(item, qtde, via, aprazamento, moment().startOf('day').add(horas, 'hours'), observacao, justificativa);
      }
      setTimeout(() => {
        pushComponente(4, item.tag_componente, item.iditem);
      }, 2000);
    }
    setTimeout(() => {
      loadItensPrescricoes(idprescricao, item.nome_item);
    }, 2500);
  }

  const pushMassiveItem = (item, qtde, via, aprazamento, horario, observacao, justificativa) => {
    var obj = {
      idpct: idpaciente,
      idatendimento: idatendimento,
      idprescricao: idprescricao,
      iditem: item.iditem,
      nome_item: item.nome_item,
      keyword_item: item.keyword_item,
      qtde: qtde,
      via: via,
      horario: horario,
      observacao: observacao,
      status: 0,
      justificativa: justificativa,
      datainicio: moment(),
      datatermino: moment().add(1, 'day'),
      tipoitem: item.tipoitem,
      aprazamento: aprazamento,
      tag_componente: item.tag_componente
    };
    // alert(JSON.stringify(obj));
    axios.post(htmlinsertitemprescricao, obj).then(() => {
      // alert(JSON.stringify(obj));
    })
      .catch(err => alert(err));
  }

  // atualizando a quantidade de um item da prescri????o.
  const updateItemQtde = (quantidade, item) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      var obj = {
        idpct: idpaciente,
        idatendimento: idatendimento,
        idprescricao: idprescricao,
        iditem: item.iditem,
        nome_item: item.nome_item,
        keyword_item: item.keyword_item,
        qtde: quantidade,
        via: item.via,
        horario: item.horario,
        observacao: item.observacao,
        status: item.status,
        justificativa: item.justificativa,
        datainicio: item.datainicio,
        datatermino: item.datatermino,
        tipoitem: item.tipoitem,
        aprazamento: item.aprazamento,
        tag_componente: item.tag_componente
      };
      alert(JSON.stringify(obj));
      axios.post(htmlupdateitemprescricao + item.id, obj).then(() => {
        // carregando a lista de itens prescritos.
        loadItensPrescricoes(idprescricao, '');
      });
    }, 1000);
  }

  // atualizando o aprazamento para administra????o de um item da prescri????o.
  const clickItemAprazamento = (item) => {
    setshowitemhorarioselector(2);
    setid(item.id);
    setiditem(item.iditem);
    setnome_item(item.nome_item);
    setkeyword_item(item.keyword_item);
    setqtde(item.qtde);
    setvia(item.via);
    sethorario(item.horario);
    setobservacao(item.observacao);
    setstatus(item.status);
    setjustificativa(item.justificativa);
    settipoitem(item.tipoitem);
    setaprazamento(item.aprazamento);
  }
  // atualizar aprazamento de item de prescri????o (n??o massivo).
  const updateItemAprazamento = (item, horario) => {
    var aprazamento = null;
    if (horario == 'ACM' || horario == 'SN' || horario == 'AGORA') {
      aprazamento = moment();
    } else {
      aprazamento = moment(horario, 'DD/MM/YY - HH:mm');
    }
    var obj = {
      idpct: idpaciente,
      idatendimento: idatendimento,
      idprescricao: idprescricao,
      iditem: item.iditem,
      nome_item: item.nome_item,
      keyword_item: item.keyword_item,
      qtde: item.qtde,
      via: item.via,
      horario: aprazamento,
      observacao: item.observacao,
      status: item.status,
      justificativa: item.justificativa,
      datainicio: item.datainicio,
      datatermino: item.datatermino,
      tipoitem: item.tipoitem,
      aprazamento: item.aprazamento,
      tag_componente: item.tag_componente
    }
    alert(JSON.stringify(obj));
    axios.post(htmlupdateitemprescricao + item.id, obj).then(() => {
      loadItensPrescricoes(idprescricao, '');
    });
  }

  // renderiza????o do seletor de op????es para via de adminitra????o de um item.
  const [showitemviaselector, setshowitemviaselector] = useState(0);
  var arrayitemvia = ['VO', 'IV', 'IM', 'SC', 'INTRAD??RMICA', 'HIPODERM??CLISE', 'INTRATECAL'];

  // arrays para seletores de op????es para hor??rios de adminitra????o de um item.
  const [showitemhorarioselector, setshowitemhorarioselector] = useState(0);
  var arrayitemhorario = [
    '1/1H', '2/2H', '3/3H', '4/4H', '6/6H', '8/8H', '12/12H', '24/24H', '48/48H', '72/72H',
    'ACM', 'SN', 'AGORA'];
  var arrayclock = [
    moment().startOf('day').add(13, 'hours').format('DD/MM/YY - HH:mm'),
    moment().startOf('day').add(14, 'hours').format('DD/MM/YY - HH:mm'),
    moment().startOf('day').add(15, 'hours').format('DD/MM/YY - HH:mm'),
    moment().startOf('day').add(16, 'hours').format('DD/MM/YY - HH:mm'),
    moment().startOf('day').add(17, 'hours').format('DD/MM/YY - HH:mm'),
    moment().startOf('day').add(18, 'hours').format('DD/MM/YY - HH:mm'),
    moment().startOf('day').add(19, 'hours').format('DD/MM/YY - HH:mm'),
    moment().startOf('day').add(20, 'hours').format('DD/MM/YY - HH:mm'),
    moment().startOf('day').add(21, 'hours').format('DD/MM/YY - HH:mm'),
    moment().startOf('day').add(22, 'hours').format('DD/MM/YY - HH:mm'),
    moment().startOf('day').add(23, 'hours').format('DD/MM/YY - HH:mm'),
    moment().startOf('day').add(24, 'hours').format('DD/MM/YY - HH:mm'),
    moment().startOf('day').add(25, 'hours').format('DD/MM/YY - HH:mm'),
    moment().startOf('day').add(26, 'hours').format('DD/MM/YY - HH:mm'),
    moment().startOf('day').add(27, 'hours').format('DD/MM/YY - HH:mm'),
    moment().startOf('day').add(28, 'hours').format('DD/MM/YY - HH:mm'),
    moment().startOf('day').add(29, 'hours').format('DD/MM/YY - HH:mm'),
    moment().startOf('day').add(30, 'hours').format('DD/MM/YY - HH:mm'),
    moment().startOf('day').add(31, 'hours').format('DD/MM/YY - HH:mm'),
    moment().startOf('day').add(32, 'hours').format('DD/MM/YY - HH:mm'),
    moment().startOf('day').add(33, 'hours').format('DD/MM/YY - HH:mm'),
    moment().startOf('day').add(34, 'hours').format('DD/MM/YY - HH:mm'),
    moment().startOf('day').add(35, 'hours').format('DD/MM/YY - HH:mm'),
    moment().startOf('day').add(36, 'hours').format('DD/MM/YY - HH:mm'),
    'ACM', 'SN', 'AGORA'];

  // atualizando a justificativa relativa ao item da prescri????o (aplic??vel aos antibi??ticos).
  const updateJustificativa = (value, item) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      //document.getElementById("PRINCIPAL").style.pointerEvents = 'none';
      var obj = {
        id: item.id,
        idatendimento: item.idatendimento,
        idprescricao: item.idprescricao,
        codigo: item.codigo,
        grupo: item.grupo,
        farmaco: item.farmaco,
        qtde: item.qtde,
        via: item.via,
        horario: item.horario,
        observacao: item.observacao,
        status: item.status,
        justificativa: value.toUpperCase(),
        datainicio: item.datainicio,
        datatermino: item.datatermino,
      };
      axios.post(html + '/updateitemprescricao/' + item.id, obj);
      setTimeout(() => {
        loadItensPrescricoesById(idprescricao, item.id);
      }, 1000);
    }, 1000);
  }
  // atualizando a data de in??cio da administra????o do item da prescri????o (aplic??vel aos antibi??ticos).
  const [datainicioatb, setdatainicioatb] = useState('')
  const updateDataInicio = (value, item) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      //document.getElementById("PRINCIPAL").style.pointerEvents = 'none';
      setdatainicioatb(value);
      var obj = {
        id: item.id,
        idatendimento: item.idatendimento,
        idprescricao: item.idprescricao,
        codigo: item.codigo,
        grupo: item.grupo,
        farmaco: item.farmaco,
        qtde: item.qtde,
        via: item.via,
        horario: item.horario,
        observacao: item.observacao,
        status: item.status,
        justificativa: item.justificativa,
        datainicio: value,
        datatermino: item.datatermino,
      };
      axios.post(html + '/updateitemprescricao/' + item.id, obj);
      setTimeout(() => {
        loadItensPrescricoesById(idprescricao, item.id);
      }, 1000);
    }, 3000);
  }
  // atualizando a data de t??rmino da administra????o do item da prescri????o (aplic??vel aos antibi??ticos).
  const [diasatb, setdiasatb] = useState();
  const updateDataTermino = (value, item) => {
  }

  // fun????o que atualiza a quantidade dos componentes relacionados a um item.
  const updateComponent = (quantidade, componente) => {
    listcomponentes.filter(valor => valor.iditem == componente.iditem & valor.componente == componente.componente).map(x => {
      var obj = {
        idpct: idpaciente,
        idatendimento: idatendimento,
        idprescricao: idprescricao,
        iditemprescricao: x.iditemprescricao,
        componente: x.componente,
        qtde: quantidade,
        iditem: x.iditem,
      };
      axios.post(htmlupdatecomponenteprescricao + x.id, obj).then(() => {
        loadItensPrescricoes(idprescricao, '');
      })
    })
  }

  // excluindo um componente de um item da prescri????o.
  const deleteComponent = (componente) => {
    listcomponentes.filter(item => item.componente == componente.componente && item.iditem == componente.iditem).map(valor => {
      axios.get(htmldeletecomponenteprescricaopontual + valor.id);
    });
  }

  // tratando entradas no input quantidade.
  const checkQuantidade = (value) => {
    if (value > 100) {
      document.getElementById("inputQuantidade").value = '';
    }
  }
  // popup para sele????o de um novo componente.
  const [viewinsertcomponente, setviewinsertcomponent] = useState(0);
  function InsertComponent() {
    if (viewinsertcomponente === 1) {
      return (
        <div className="menucover" onClick={() => setviewinsertcomponent(0)} style={{ zIndex: 9, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div className="menucontainer" onClick={(e) => e.stopPropagation()}>
            <div className="title2" style={{ fontSize: 14, marginBottom: 10 }}>INSERIR COMPONENTE</div>
            <input
              className="input"
              autoComplete="off"
              placeholder="BUSCAR COMPONENTE..."
              onFocus={(e) => { (e.target.placeholder = ''); e.stopPropagation() }}
              onBlur={(e) => { (e.target.placeholder = 'BUSCAR COMPONENTE...'); e.stopPropagation() }}
              onChange={(e) => { filterComponente(); e.stopPropagation() }}
              style={{
                width: 0.3 * window.innerWidth,
                margin: 0,
                marginBottom: 5,
              }}
              type="text"
              id="inputFilterComponente"
              defaultValue={filtercomponente}
              maxLength={100}
            ></input>
            <div
              className="scroll"
              id="LISTA DE COMPONENTES PARA SELE????O"
              style={{
                justifyContent: 'flex-start',
                margin: 5,
                marginTop: 5,
                padding: 0,
                paddingRight: 5,
                height: '60vh',
                width: '60vw'
              }}
            >
              {arrayfiltercomponente.map((valor) => (
                <p
                  key={valor.id}
                  id="item da lista"
                  className="row"
                  style={{ margin: 5, marginRight: 0, marginTop: 2.5, marginBottom: 2.5 }}
                >
                  <button
                    onClick={() => getComponent(selecteditem, valor)}
                    className="blue-button"
                    style={{
                      width: '100%',
                      paddingRight: 10,
                      margin: 2.5,
                      flexDirection: 'column',
                    }}
                  >
                    {valor.ds_produto}
                  </button>
                </p>
              ))}
            </div>
          </div>
        </div>
      )
    } else {
      return null;
    }
  }

  // 20JAN2021 - PRESCRI????O (VIS??O DO T??CNICO DE ENFERMAGEM).
  // carregando a lista de prescri????es contendo os itens chec??veis.
  const [listcheckprescricoes, setlistcheckprescricoes] = useState([]);
  // carregando os itens de prescri????es ativas (salvas e com hor??rio a partir das 13h do dia anterior).
  const loadCheckPrescricoes = () => {
    // recuperando as prescri????es ativas.
    axios.get(html + "/prescricaoativa/" + idatendimento).then((response) => {
      setlistcheckprescricoes(response.data);
      var x = [0, 1];
      x = response.data;
      // recuperando os itens de cada prescri????o ativa.
      x.map((item) => getCheckItens(item.id));
    });
    // recuperando os hor??rios para checagem da administra????o das medica????es.
    //getHorarios();
  }
  const [listcheckitensprescricoes, setlistcheckitensprescricoes] = useState([]);
  const getCheckItens = (idprescricao) => {
    axios.get(html + "/itensprescricao/" + idprescricao).then((response) => {
      // adicionando o item carregado ?? array de itens.
      setlistcheckitensprescricoes(response.data);
    });
  }
  const [listcheckhorariosprescricoes, setlistcheckhorariosprescricoes] = useState([]);
  const getHorarios = () => {
    axios.get(html + "/checagemall").then((response) => {
      setlistcheckhorariosprescricoes(response.data);
    });
  }

  // checando um hor??rio indicando a realiza????o da medica????o.
  const checkDone = (item) => {
    if (item.checado === 0) {
      var obj = {
        idprescricao: item.idprescricao,
        iditem: item.iditem,
        horario: item.horario,
        checado: 1,
        datachecado: moment().format('DD/MM/YY HH:mm'),
      };
      axios.post(html + "/updatechecagemprescricao/'" + item.id + "'", obj).then(() => {
        getHorarios();
        setTimeout(() => {
        }, 1000);
      });
    } else {
      var obj = {
        idprescricao: item.idprescricao,
        iditem: item.iditem,
        horario: item.horario,
        checado: 0,
        datachecado: '',
      };
      axios.post(html + "/updatechecagemprescricao/'" + item.id + "'", obj).then(() => {
        getHorarios();
      });
    }
  }

  // visualiza????o da prescri????o para uso dos t??cnicos de enfermagem.
  function ShowTecnicosPrescricao() {
    if (stateprontuario == 10) {
      return (
        <div
          className="scroll"
          id="LISTA DE ITENS PRESCRITOS - T??CNICO"
          // onScroll={() => scrollPositionTec()}
          // onMouseOver={() => keepScrollTec()}
          // onLoad={() => keepScrollTec()}
          style={{
            display: stateprontuario == 10 ? 'flex' : 'none', height: '80vh', width: '82vw',
          }}
        >
          {listprescricoes.map((item) => (
            <div
              key={item.id}
              id="prescri????o"
              className="row"
            >
              <div style={{ justifyContent: 'flex-start', padding: 10, width: '100%' }}>
                <button className="blue-button" style={{ padding: 15, margin: 0, backgroundColor: '#f39c12', }}>
                  {'PRESCRI????O: ' + item.data}
                </button>
                {listitensprescricao.map((item) => (
                  <div style={{ padding: 0, paddingTop: 15, margin: 0 }}>
                    <button
                      className="row"
                      style={{ margin: 0, padding: 5 }}
                    >
                      <div
                        id="F??RMACO"
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-start',
                          width: '100%',
                        }}>
                        <div id="APRESENTA????O"
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            width: '100%',
                          }}>
                          <button className="blue-button"
                            style={{
                              margin: 5,
                              padding: 10,
                              width: '35vw',
                              minHeight: 50,
                              fontSize: 15,
                              backgroundColor: '#8f9bbc'
                            }}>
                            {item.farmaco}
                          </button>
                          <div className="title2"
                            style={{
                              margin: 5,
                              padding: 5,
                              minHeight: 50,
                              width: '100%',
                              justifyContent: 'flex-start',
                              alignSelf: 'flex-start',
                            }}>
                            <div style={{ flexDirection: 'column' }}>
                              <div style={{ marginBottom: 2.5 }}>OBSERVA????ES:</div>
                              <div>{item.observacao}</div>
                            </div>
                          </div>
                        </div>
                        <button className="hover-button"
                          style={{
                            // display: listcheckcomponentes.filter((valor) => valor.iditem === item.id).length > 0 ? 'flex' : 'none',
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                            margin: 5,
                            padding: 5,
                            height: 120,
                          }}>
                          <div style={{ padding: 2.5, opacity: 0.6 }}>COMPONENTES:</div>
                          {listcomponentes.map((valor) => (
                            <div
                              key={valor.id}
                              id="COMPONENTES"
                              style={{
                                margin: 0,
                                flexDirection: 'column',
                                justifyContent: 'center',
                                width: '100%',
                              }}
                            >
                              <div
                                style={{
                                  display: valor.iditem === item.id ? 'flex' : 'none',
                                  margin: 2.5,
                                  padding: 0,
                                  flexDirection: 'column',
                                  justifyContent: 'flex-start',
                                  textAlign: 'left',
                                  width: '100%',
                                }}
                              >{valor.componente + ' - ' + valor.quantidade + ' UNIDADE.'}
                              </div>
                            </div>
                          ))}
                        </button>
                        <div id="CHECAGENS"
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            flexWrap: 'wrap',
                            height: '100%',
                            width: '100%',
                          }}>
                          {listcheckhorariosprescricoes.map((value) => (
                            <button
                              key={value.id}
                              className={value.checado === 1 ? "green-button" : "red-button"}
                              title={value.checado === 1 ? "ITEM CHECADO." : "CLIQUE PARA CHECAR."}
                              style={{
                                display: value.iditem === item.id && value.idprescricao === item.idprescricao ? 'flex' : 'none',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                width: 90,
                                height: 130,
                                margin: 5,
                              }}
                            >
                              <div
                                style={{ textAlign: 'center', alignSelf: 'center', padding: 0 }}
                                onClick={() => checkDone(value)}
                              >
                                <img
                                  alt=""
                                  src={clock}
                                  style={{
                                    margin: 5,
                                    marginBottom: 2.0,
                                    height: 20,
                                    width: 20,
                                  }}
                                ></img>
                              </div>
                              <div
                                style={{ textAlign: 'center', alignSelf: 'center', padding: 0 }}
                                onClick={() => checkDone(value)}
                              >
                                {value.horario}
                              </div>
                              <div
                                style={{
                                  textAlign: 'center', alignSelf: 'center', padding: 0,
                                  display: value.datachecado !== '' ? 'flex' : 'none',
                                }}
                                onClick={() => checkDone(value)}
                              >
                                {'???'}
                              </div>
                              <div
                                style={{
                                  textAlign: 'center', alignSelf: 'center', padding: 0,
                                  display: value.datachecado !== '' ? 'flex' : 'none',
                                }}
                                onClick={() => checkDone(value)}
                              >
                                {value.datachecado}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>

          ))}
        </div>
      );
    } else {
      return null;
    }
  }

  // renderiza????o do componente.
  return (
    <div style={{ display: stateprontuario == 9 || stateprontuario == 10 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center' }}>
      <Toast valortoast={valortoast} cor={cor} mensagem={mensagem} tempo={tempo} />
      <div className="conteudo" style={{ flexDirection: 'row', justifyContent: 'center', paddingLeft: 5, paddingRight: 5 }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <SearchItensPrescription></SearchItensPrescription>
          <CabecalhoPrescricao></CabecalhoPrescricao>
          <ItensPrescricao></ItensPrescricao>
          <ShowTecnicosPrescricao></ShowTecnicosPrescricao>
        </div>
        <ShowPrescricoes></ShowPrescricoes>
      </div>
      <PrintPrescricao
        // vari??veis da corrida.
        hospital={nomehospital}
        unidade={nomeunidade}
        // vari??veis da prescri????o.
        viewprintprescricao={viewprintprescricao}
        idprescricao={idprescricao}
        data={dataprescricao}
        idatendimento={idatendimento}
        idusuario={idusuario}
        usuario={nomeusuario}
        funcao={tipousuario}
        conselho={especialidadeusuario}
        box={box}
        nome={nomepaciente}
        dn={listatendimentos.map(item => item.dn)}
        alergias={listatendimentos.map(item => item.dn)}
        precaucao={listatendimentos.map(item => item.precaucao)}
      />
      <SelectModelPrescricao></SelectModelPrescricao>

      <InsertComponent></InsertComponent>
      <Hemoderivados></Hemoderivados>
    </div>
  )
}
export default Prescricao;