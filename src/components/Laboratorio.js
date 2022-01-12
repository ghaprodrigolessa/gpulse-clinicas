/* eslint eqeqeq: "off" */
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import moment from 'moment';
import deletar from '../images/deletar.svg';
import salvar from '../images/salvar.svg';
import MaskedInput from 'react-maskedinput';
import { useHistory } from "react-router-dom";
import DatePicker from './DatePicker';
import Context from '../Context';

function Laboratorio({ viewlaboratorio }) {
  //servidor.
  var html = 'https://pulsarapp-server.herokuapp.com';
  var htmllaboratorio = process.env.REACT_APP_API_LABORATORIO;

  // recuperando estados globais (Context.API).
  const {
    idatendimento,
    pickdate1, setpickdate1,
    setlistlaboratorio,
    setarraylaboratorio,
  } = useContext(Context)

  // chave para exibição do componente.
  const [viewcomponent, setviewcomponent] = useState(viewlaboratorio);

  useEffect(() => {
    if (viewlaboratorio === 1) {
      loadOptionsLaboratorio();
      showDatePicker(0, 0);
      setpickdate1('');
      setviewcomponent(viewlaboratorio);
      // retornando estados ao padrão.
      setagorabtn(0);
      setrotinabtn(0);
      setagendadobtn(0);
      setViewSearchLab(0);
      // limpando as listas de exames disponíveis e filtrados.
      setselectedlistlab([]);
      setarrayfilterlab([]);
    } else {
    }
  }, [viewlaboratorio])

  const loadLaboratorio = () => {
    axios.get(html + "/lab/'" + idatendimento + "'").then((response) => {
      var x = [0, 1];
      x = response.data;
      setlistlaboratorio(x.sort((a, b) => moment(a.datapedido, 'DD/MM/YYYY HH:MM') < moment(b.datapedido, 'DD/MM/YYYY HH:MM') ? 1 : -1).filter(item => item.idatendimento == idatendimento));
      setarraylaboratorio(x.sort((a, b) => moment(a.datapedido, 'DD/MM/YYYY HH:MM') < moment(b.datapedido, 'DD/MM/YYYY HH:MM') ? 1 : -1).filter(item => item.idatendimento == idatendimento));
    });
  }

  // inserindo registro.
  const insertData = (item) => {
    var exame = listlab.filter(valor => valor.codigo_exame_laboratorio == item)
    var obj = {
      codigo_exame_laboratorio: item.codigo_exame_laboratorio,
      nome_exame_laboratorio: exame.nome_exame_laboratorio,
      // ... como inserir no MV, Felipe?
    };
    axios.post(html + '/insertlab', obj);
  };

  const [arraylab, setarraylab] = useState([]);
  // inserindo exames coringa na array de exames laboratoriais a serem solicitados (arraylab).
  // FUNÇÃO RENAL.
  const [ureiabtn, setureiabtn] = useState(0);
  const clickUreia = () => {
    if (ureiabtn === 0) {
      setureiabtn(1);
      var ureia =
      {
        codigo_exame_laboratorio: 642,
      }
      arraylab.push(ureia);
      console.log(arraylab.length);
    } else {
      setureiabtn(0);
      // encontrar o item na array e fazer o delete.
      const x = arraylab.indexOf((item) => item.codigo_exame_laboratorio == 642);
      arraylab.splice(x, 1);
    }
  }
  const [creatininabtn, setcreatininabtn] = useState(0);
  const clickCreatinina = () => {
    if (creatininabtn === 0) {
      setcreatininabtn(1);
      var creatinina =
      {
        codigo_exame_laboratorio: 1385,
      }
      arraylab.push(creatinina);
    } else {
      setcreatininabtn(0);
      // encontrar o item na array e fazer o delete.
      const x = arraylab.indexOf((item) => item.codigo_exame_laboratorio == 1385);
      arraylab.splice(x, 1);
    }
  }
  // ELETRÓLITOS.
  const [sodiobtn, setsodiobtn] = useState(0);
  const clickSodio = () => {
    if (sodiobtn === 0) {
      setsodiobtn(1);
      var sodio =
      {
        codigo_exame_laboratorio: 451,
      }
      arraylab.push(sodio);
    } else {
      setsodiobtn(0);
      // encontrar o item na array e fazer o delete.
      const x = arraylab.indexOf((item) => item.codigo_exame_laboratorio == 451);
      arraylab.splice(x, 1);
    }
  }
  const [potassiobtn, setpotassiobtn] = useState(0);
  const clickPotassio = () => {
    if (potassiobtn === 0) {
      setpotassiobtn(1);
      var potassio =
      {
        codigo_exame_laboratorio: 1025,
      }
      arraylab.push(potassio);
    } else {
      setpotassiobtn(0);
      // encontrar o item na array e fazer o delete.
      const x = arraylab.indexOf((item) => item.codigo_exame_laboratorio == 1025);
      arraylab.splice(x, 1);
    }
  }
  const [magnesiobtn, setmagnesiobtn] = useState(0);
  const clickMagnesio = () => {
    if (magnesiobtn === 0) {
      setmagnesiobtn(1);
      var magnesio =
      {
        codigo_exame_laboratorio: 1565,
      }
      arraylab.push(magnesio);
    } else {
      setmagnesiobtn(0);
      // encontrar o item na array e fazer o delete.
      const x = arraylab.indexOf((item) => item.codigo_exame_laboratorio == 1565);
      arraylab.splice(x, 1);
    }
  }
  const [fosforobtn, setfosforobtn] = useState(0);
  const clickFosforo = () => {
    if (fosforobtn === 0) {
      setfosforobtn(1);
      var fosforo =
      {
        codigo_exame_laboratorio: 471,
      }
      arraylab.push(fosforo);
    } else {
      setfosforobtn(0);
      // encontrar o item na array e fazer o delete.
      const x = arraylab.indexOf((item) => item.codigo_exame_laboratorio == 471);
      arraylab.splice(x, 1);
    }
  }
  // GASOMETRIAS E LACTATO.
  const [gasoartbtn, setgasoartbtn] = useState(0);
  const clickGasoart = () => {
    if (gasoartbtn === 0) {
      setgasoartbtn(1);
      var gasoart =
      {
        codigo_exame_laboratorio: 1609,
      }
      arraylab.push(gasoart);
    } else {
      setgasoartbtn(0);
      // encontrar o item na array e fazer o delete.
      const x = arraylab.indexOf((item) => item.codigo_exame_laboratorio == 1609);
      arraylab.splice(x, 1);
    }
  }
  const [gasovenbtn, setgasovenbtn] = useState(0);
  const clickGasoven = () => {
    if (gasovenbtn === 0) {
      setgasovenbtn(1);
      var gasoven =
      {
        codigo_exame_laboratorio: 1617,
      }
      arraylab.push(gasoven);
    } else {
      setgasovenbtn(0);
      // encontrar o item na array e fazer o delete.
      const x = arraylab.indexOf((item) => item.codigo_exame_laboratorio == 1617);
      arraylab.splice(x, 1);
    }
  }
  const [lactatobtn, setlactatobtn] = useState(0);
  const clickLactato = () => {
    if (lactatobtn === 0) {
      setlactatobtn(1);
      var lactato =
      {
        codigo_exame_laboratorio: 57,
      }
      arraylab.push(lactato);
    } else {
      setlactatobtn(0);
      // encontrar o item na array e fazer o delete.
      const x = arraylab.indexOf((item) => item.codigo_exame_laboratorio == 57);
      arraylab.splice(x, 1);
    }
  }
  const [cloretobtn, setcloretobtn] = useState(0);
  const clickCloreto = () => {
    if (cloretobtn === 0) {
      setcloretobtn(1);
      var cloreto =
      {
        codigo_exame_laboratorio: 1560,
      }
      arraylab.push(cloreto);
    } else {
      setcloretobtn(0);
      // encontrar o item na array e fazer o delete.
      const x = arraylab.indexOf((item) => item.codigo_exame_laboratorio == 1560);
      arraylab.splice(x, 1);
    }
  }
  // HEMOGRAMA E PCR.
  const [hemogramabtn, sethemogramabtn] = useState(0);
  const clickHemograma = () => {
    if (hemogramabtn === 0) {
      sethemogramabtn(1);
      var hemograma =
      {
        codigo_exame_laboratorio: 1547,
      }
      arraylab.push(hemograma);
    } else {
      sethemogramabtn(0);
      // encontrar o item na array e fazer o delete.
      const x = arraylab.indexOf((item) => item.codigo_exame_laboratorio == 1547);
      arraylab.splice(x, 1);
    }
  }
  const [pcrbtn, setpcrbtn] = useState(0);
  const clickPcr = () => {
    if (pcrbtn === 0) {
      setpcrbtn(1);
      var pcr =
      {
        codigo_exame_laboratorio: 1042,
      }
      arraylab.push(pcr);
    } else {
      setpcrbtn(0);
      // encontrar o item na array e fazer o delete.
      const x = arraylab.indexOf((item) => item.codigo_exame_laboratorio == 1042);
      arraylab.splice(x, 1);
    }
  }
  // COAGULOGRAMA.
  const [tapbtn, settapbtn] = useState(0);
  const clickTap = () => {
    if (tapbtn === 0) {
      settapbtn(1);
      var tap =
      {
        codigo_exame_laboratorio: 497,
      }
      arraylab.push(tap);
    } else {
      settapbtn(0);
      // encontrar o item na array e fazer o delete.
      const x = arraylab.indexOf((item) => item.codigo_exame_laboratorio == 497);
      arraylab.splice(x, 1);
    }
  }
  const [pttbtn, setpttbtn] = useState(0);
  const clickPtt = () => {
    if (pttbtn === 0) {
      setpttbtn(1);
      var ptt =
      {
        codigo_exame_laboratorio: 1587,
      }
      arraylab.push(ptt);
    } else {
      setpttbtn(0);
      // encontrar o item na array e fazer o delete.
      const x = arraylab.indexOf((item) => item.codigo_exame_laboratorio == 1587);
      arraylab.splice(x, 1);
    }
  }
  // HEPATOGRAMA.
  const [tgobtn, settgobtn] = useState(0);
  const clickTgo = () => {
    if (tgobtn === 0) {
      settgobtn(1);
      var tgo =
      {
        codigo_exame_laboratorio: 581,
      }
      var tgp =
      {
        codigo_exame_laboratorio: 585,
      }
      arraylab.push(tgo, tgp);
    } else {
      settgobtn(0);
      // encontrar o item na array e fazer o delete.
      const x = arraylab.indexOf((item) => item.codigo_exame_laboratorio == 585);
      arraylab.splice(x, 1);
    }
  }
  const [falbtn, setfalbtn] = useState(0);
  const clickFal = () => {
    if (falbtn === 0) {
      setfalbtn(1);
      var fal =
      {
        codigo_exame_laboratorio: 348,
      }
      arraylab.push(fal);
    } else {
      setfalbtn(0);
      // encontrar o item na array e fazer o delete.
      const x = arraylab.indexOf((item) => item.codigo_exame_laboratorio == 348);
      arraylab.splice(x, 1);
    }
  }
  const [ggtbtn, setggtbtn] = useState(0);
  const clickGgt = () => {
    if (ggtbtn === 0) {
      setggtbtn(1);
      var ggt =
      {
        codigo_exame_laboratorio: 518,
      }
      arraylab.push(ggt);
    } else {
      setggtbtn(0);
      // encontrar o item na array e fazer o delete.
      const x = arraylab.indexOf((item) => item.codigo_exame_laboratorio == 518);
      arraylab.splice(x, 1);
    }
  }
  const [btfbtn, setbtfbtn] = useState(0);
  const clickBtf = () => {
    if (btfbtn === 0) {
      setbtfbtn(1);
      var btf =
      {
        codigo_exame_laboratorio: 154,
      }
      arraylab.push(btf);
    } else {
      setbtfbtn(0);
      // encontrar o item na array e fazer o delete.
      const x = arraylab.indexOf((item) => item.codigo_exame_laboratorio == 154);
      arraylab.splice(x, 1);
    }
  }
  const [amilasebtn, setamilasebtn] = useState(0);
  const clickAmilase = () => {
    if (amilasebtn === 0) {
      setamilasebtn(1);
      var amilase =
      {
        codigo_exame_laboratorio: 104,
      }
      arraylab.push(amilase);
    } else {
      setamilasebtn(0);
      // encontrar o item na array e fazer o delete.
      const x = arraylab.indexOf((item) => item.codigo_exame_laboratorio == 104);
      arraylab.splice(x, 1);
    }
  }
  const [lipasebtn, setlipasebtn] = useState(0);
  const clickLipase = () => {
    if (lipasebtn === 0) {
      setlipasebtn(1);
      var lipase =
      {
        codigo_exame_laboratorio: 814,
      }
      arraylab.push(lipase);
    } else {
      setlipasebtn(0);
      // encontrar o item na array e fazer o delete.
      const x = arraylab.indexOf((item) => item.codigo_exame_laboratorio == 814);
      arraylab.splice(x, 1);
    }
  }
  // CULTURAS.
  // hemocultura - 1a amostra.
  const [hemoc1btn, sethemoc1btn] = useState(0);
  const clickHemoc1 = () => {
    if (hemoc1btn === 0) {
      sethemoc1btn(1);
      var hemoc =
      {
        codigo_exame_laboratorio: 1563,
      }
      arraylab.push(hemoc);
    } else {
      sethemoc1btn(0);
      // encontrar o item na array e fazer o delete.
      const x = arraylab.indexOf((item) => item.codigo_exame_laboratorio == 1563);
      arraylab.splice(x, 1);
    }
  }
  // hemocultura - 2a amostra.
  const [hemoc2btn, sethemoc2btn] = useState(0);
  const clickHemoc2 = () => {
    if (hemoc2btn === 0) {
      sethemoc2btn(1);
      var hemoc =
      {
        codigo_exame_laboratorio: 1577,
      }
      arraylab.push(hemoc);
    } else {
      sethemoc2btn(0);
      // encontrar o item na array e fazer o delete.
      const x = arraylab.indexOf((item) => item.codigo_exame_laboratorio == 1577);
      arraylab.splice(x, 1);
    }
  }
  // hemocultura - 3a amostra.
  const [hemoc3btn, sethemoc3btn] = useState(0);
  const clickHemoc3 = () => {
    if (hemoc3btn === 0) {
      sethemoc3btn(1);
      var hemoc =
      {
        codigo_exame_laboratorio: 1587,
      }
      arraylab.push(hemoc);
    } else {
      sethemoc3btn(0);
      // encontrar o item na array e fazer o delete.
      const x = arraylab.indexOf((item) => item.codigo_exame_laboratorio == 1587);
      arraylab.splice(x, 1);
    }
  }
  // urocultura.
  const [urocbtn, seturocbtn] = useState(0);
  const clickUroc = () => {
    if (urocbtn === 0) {
      seturocbtn(1);
      var uroc =
      {
        codigo_exame_laboratorio: 1579,
      }
      arraylab.push(uroc);
    } else {
      seturocbtn(0);
      // encontrar o item na array e fazer o delete.
      const x = arraylab.indexOf((item) => item.codigo_exame_laboratorio == 1579);
      arraylab.splice(x, 1);
    }
  }
  // cultura de aspirado traqueal.
  const [minibalbtn, setminibalbtn] = useState(0);
  const clickMinibal = () => {
    if (minibalbtn === 0) {
      setminibalbtn(1);
      var minibal =
      {
        codigo_exame_laboratorio: 1310,
      }
      arraylab.push(minibal);
    } else {
      setminibalbtn(0);
      // encontrar o item na array e fazer o delete.
      const x = arraylab.indexOf((item) => item.codigo_exame_laboratorio == 1310);
      arraylab.splice(x, 1);
    }
  }

  // inserindo os registros de exames laboratoriais solicitados no banco de dados.
  const insertLab = () => {
    arraylab.map((item) => insertData(item));
    setTimeout(() => {
      loadLaboratorio();
      setViewSearchLab(0);
      fechar();
    }, 2000);
  }

  // botões para definição da data e hora da coleta.
  const [dataPedido, setDatapedido] = useState('');
  const [agorabtn, setagorabtn] = useState(0);
  const [rotinabtn, setrotinabtn] = useState(0);
  const [agendadobtn, setagendadobtn] = useState(0);

  const clickAgorabtn = () => {
    setDatapedido(moment().format('DD/MM/YYYY HH:mm'));
    setagorabtn(1);
    setrotinabtn(0);
    setagendadobtn(0);
  }
  const clickRotinabtn = () => {
    setDatapedido(moment().format('DD/MM/YYYY') + ' 23:00');
    setagorabtn(0);
    setrotinabtn(1);
    setagendadobtn(0);
  }
  const clickAgendadobtn = () => {
    showDatePicker(1, 1);
    setagorabtn(0);
    setrotinabtn(0);
    setagendadobtn(1);
    document.getElementById("inputHora").value = '';
  }

  // carregando lista de opções de exames laboratoriais.
  const [listlab, setlistlab] = useState([])
  const loadOptionsLaboratorio = () => {
    axios.get(htmllaboratorio).then((response) => {
      setlistlab(response.data);
    });
  }

  // array com os exames laboratoriais selecionados.
  const [selectedlistlab, setselectedlistlab] = useState([]);
  // funções e componentes para busca e adição de outros exames.
  const [filterlab, setfilterlab] = useState('');
  var searchlab = '';
  var timeout = null;
  const [arrayfilterlab, setarrayfilterlab] = useState(listlab);
  const filterLab = () => {
    clearTimeout(timeout);
    document.getElementById("inputFilterLab").focus();
    searchlab = document.getElementById("inputFilterLab").value.toUpperCase();
    timeout = setTimeout(() => {
      if (searchlab == '') {
        setarrayfilterlab([]);
        document.getElementById("inputFilterLab").value = '';
        document.getElementById("inputFilterLab").focus();
      } else {
        setfilterlab(document.getElementById("inputFilterLab").value.toUpperCase());
        setarrayfilterlab(listlab.filter(item => item.nome_exame_laboratorio.includes(searchlab) == true));
        document.getElementById("inputFilterLab").value = searchlab;
        document.getElementById("inputFilterLab").focus();
      }
    }, 500);
  }
  const addLab = (item) => {
    var newlab = {
      codigo_exame_laboratorio: item.codigo_exame_laboratorio,
      nome_exame_laboratorio: item.nome_exame_laboratorio,
    }
    var addlab = {
      codigo_exame_laboratorio: item.codigo_exame_laboratorio,
    }
    if (selectedlistlab.filter(value => value.codigo_exame_laboratorio == item.codigo_exame_laboratorio).length < 1) {
      selectedlistlab.push(newlab);
      arraylab.push(addlab);
      setarrayfilterlab([]);
      setfilterlab('');
      document.getElementById("inputFilterLab").value = '';
      document.getElementById("inputFilterLab").focus();
    }
  }
  const deleteLab = (item) => {
    const x = arraylab.filter(value => value.codigo_exame_laboratorio == item.codigo_exame_laboratorio);
    arraylab.splice(x, 1);
    selectedlistlab.splice(x, 1);
    setarrayfilterlab([]);
    setfilterlab('');
    document.getElementById("inputFilterLab").value = '';
    document.getElementById("inputFilterLab").focus();
  }
  const [viewSearchLab, setViewSearchLab] = useState(0);
  function ShowSearchLab() {
    return (
      <div id="OUTRUN" style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        width: '100%',
        height: '50vh', padding: 0, paddingTop: 5, paddingLeft: window.innerWidth > 400 ? 10 : 0,
      }}>
        <input
          className="input"
          autoComplete="off"
          placeholder="BUSCAR EXAME..."
          onFocus={(e) => { (e.target.placeholder = ''); }}
          onBlur={(e) => (e.target.placeholder = 'BUSCAR EXAME...')}
          onClick={() => document.getElementById("SELEÇÃO DE EXAMES").style.display = "none"}
          onChange={() => { filterLab(); document.getElementById("SELEÇÃO DE EXAMES").style.display = "none" }}
          style={{
            width: '100%', marginBottom: 10,
          }}
          type="text"
          id="inputFilterLab"
          defaultValue={filterlab}
          maxLength={100}
        ></input>
        <div
          className="scroll"
          id="LISTA DE EXAMES LABORATORIAIS PARA SELEÇÃO"
          style={{
            display: arrayfilterlab.length > 0 ? 'flex' : 'none',
            height: '100%',
            width: window.innerWidth > 400 ? '40vw' : '100%',
          }}
        >
          {arrayfilterlab.map((item) => (
            <div
              key={item.id}
              id="item da lista"
              className="row"
            >
              <button
                onClick={() => addLab(item)}
                className="green-button"
                style={{ width: '100%' }}
              >
                {item.nome_exame_laboratorio}
              </button>
            </div>
          ))}
        </div>
        <div
          className="scroll"
          id="LISTA DE EXAMES LABORATORIAIS PARA SELEÇÃO"
          style={{
            display: arrayfilterlab.length > 0 ? 'none' : 'flex',
            height: '100%',
            width: window.innerWidth > 400 ? '40vw' : '100%',
            margin: 0,
          }}
        >
          {selectedlistlab.map((item) => (
            <div
              id="item da lista"
              key={item.id}
              className="row"
            >
              <button
                className="hover-button"
                style={{ width: '100%' }}
              >
                {item.nome_exame_laboratorio}
              </button>
              <button className="animated-red-button"
                onClick={() => deleteLab(item)}
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
          ))}
        </div>
      </div>
    );
  }

  // inserindo a hora no agendamento da coleta de exames.
  const updateDatapedido = () => {
    clearTimeout(timeout);
    setDatapedido(pickdate1);
    var hora = document.getElementById("inputHora").value;
    var timeout = setTimeout(() => {
      setDatapedido(pickdate1 + ' ' + hora);
    }, 3000);
  }

  const fechar = () => {
    setviewcomponent(0);
    window.scrollTo(0, 0);
    document.body.style.overflow = null;
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

  // renderização do componente.
  if (viewcomponent === 1) { // inserir.
    return (
      <div className="menucover fade-in" style={{ zIndex: 9, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <DatePicker valordatepicker={valordatepicker} mododatepicker={mododatepicker} />
        <div className="menucontainer">
          <div id="cabeçalho" className="cabecalho">
            <div className="title5">{'SOLICITAR EXAME LABORATORIAL'}</div>
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
                onClick={() => insertLab()}
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
            onClick={() => document.getElementById("SELEÇÃO DE EXAMES").style.display = "flex"}
          >
            <div className="title2" style={{ fontSize: 14 }}>DATA E HORA DA COLETA:</div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginBottom: 10, width: window.innerWidth > 400 ? '40vw' : '90vw' }}>
              <button
                className="blue-button"
                onClick={() => clickAgorabtn()}
                style={{
                  width: 120,
                  margin: 2.5,
                  flexDirection: 'column',
                  opacity: agorabtn === 1 ? 1 : 0.5,
                }}
              >
                AGORA
              </button>
              <button
                className="blue-button"
                onClick={() => clickRotinabtn()}
                style={{
                  width: 120,
                  margin: 2.5,
                  flexDirection: 'column',
                  opacity: rotinabtn === 1 ? 1 : 0.5,
                }}
              >
                ROTINA
              </button>
              <button
                className="blue-button"
                onClick={() => clickAgendadobtn()}
                title="DATA E HORA AGENDADOS PARA COLETA."
                style={{
                  width: 120,
                  margin: 2.5,
                  flexDirection: 'column',
                  opacity: agendadobtn === 1 ? 1 : 0.5,
                }}
              >
                {pickdate1 != '' ? pickdate1 : 'AGENDAR'}
              </button>
              <MaskedInput
                id="inputHora"
                title="HORA DA COLETA."
                placeholder="HORA"
                autoComplete="off"
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'HORA')}
                onChange={() => updateDatapedido()}
                className="input"
                defaultValue="23:00"
                style={{
                  display: agendadobtn === 1 ? 'flex' : 'none',
                  margin: 0,
                  marginLeft: 5,
                  width: 100,
                  alignSelf: 'center',
                }}
                mask="11:11"
              />
            </div>
            <div style={{
              display: 'flex',
              flexDirection: window.innerWidth > 400 ? 'row' : 'column',
              justifyContent: window.innerWidth > 400 ? 'center' : 'flex-start',
              alignItems: 'center',
              width: '100%',
              padding: 10,
            }}>
              <div id="SELEÇÃO DE EXAMES"
                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '50vh' }}>
                <div
                  className="title2center" style={{ marginTop: 15, marginBottom: 20 }}>SELEÇÃO RÁPIDA DE EXAMES:</div>
                <div
                  className="scroll"
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-evenly',
                    alignItems: 'flex-start',
                    width: window.innerWidth > 400 ? '42vw' : '100%',
                    height: '100%',
                  }}
                >
                  <button
                    className="blue-button"
                    onClick={() => clickHemograma()}
                    style={{
                      width: window.innerWidth > 400 ? '32%' : '45%',
                      height: window.innerWidth > 400 ? '40%' : '35%',
                      margin: 2.5,
                      backgroundColor: '#AF7AC5',
                      flexDirection: 'column',
                      opacity: hemogramabtn === 1 ? 1 : 0.6,
                      padding: 10,
                    }}
                  >
                    HEMOGRAMA
                  </button>
                  <button
                    className="blue-button"
                    onClick={() => clickPcr()}
                    style={{
                      width: window.innerWidth > 400 ? '32%' : '45%',
                      height: window.innerWidth > 400 ? '40%' : '35%',
                      margin: 2.5,
                      backgroundColor: '#AF7AC5',
                      flexDirection: 'column',
                      opacity: pcrbtn === 1 ? 1 : 0.6,
                      padding: 10,
                    }}
                  >
                    PCR
                  </button>
                  <button
                    className="blue-button"
                    onClick={() => clickGasoart()}
                    style={{
                      width: window.innerWidth > 400 ? '32%' : '45%',
                      height: window.innerWidth > 400 ? '40%' : '35%',
                      margin: 2.5,
                      flexDirection: 'column',
                      backgroundColor: '#F4D03F',
                      opacity: gasoartbtn === 1 ? 1 : 0.6,
                      padding: 10,
                    }}
                  >
                    GASOMETRIA ARTERIAL
                  </button>
                  <button
                    className="blue-button"
                    onClick={() => clickGasoven()}
                    style={{
                      width: window.innerWidth > 400 ? '32%' : '45%',
                      height: window.innerWidth > 400 ? '40%' : '35%',
                      margin: 2.5,
                      backgroundColor: '#F4D03F',
                      flexDirection: 'column',
                      opacity: gasovenbtn === 1 ? 1 : 0.6,
                      padding: 10,
                    }}
                  >
                    GASOMETRIA VENOSA
                  </button>
                  <button
                    className="blue-button"
                    onClick={() => clickLactato()}
                    style={{
                      width: window.innerWidth > 400 ? '32%' : '45%',
                      height: window.innerWidth > 400 ? '40%' : '35%',
                      margin: 2.5,
                      backgroundColor: '#F4D03F',
                      flexDirection: 'column',
                      opacity: lactatobtn === 1 ? 1 : 0.6,
                      padding: 10,
                    }}
                  >
                    LACTATO
                  </button>
                  <button
                    className="blue-button"
                    onClick={() => clickCloreto()}
                    style={{
                      width: window.innerWidth > 400 ? '32%' : '45%',
                      height: window.innerWidth > 400 ? '40%' : '35%',
                      margin: 2.5,
                      backgroundColor: '#F4D03F',
                      flexDirection: 'column',
                      opacity: cloretobtn === 1 ? 1 : 0.6,
                      padding: 10,
                    }}
                  >
                    CLORETO
                  </button>
                  <button
                    className="blue-button"
                    onClick={() => clickUreia()}
                    style={{
                      width: window.innerWidth > 400 ? '32%' : '45%',
                      height: window.innerWidth > 400 ? '40%' : '35%',
                      margin: 2.5,
                      flexDirection: 'column',
                      opacity: ureiabtn === 1 ? 1 : 0.6,
                      padding: 10,
                    }}
                  >
                    URÉIA
                  </button>
                  <button
                    className="blue-button"
                    onClick={() => clickCreatinina()}
                    style={{
                      width: window.innerWidth > 400 ? '32%' : '45%',
                      height: window.innerWidth > 400 ? '40%' : '35%',
                      margin: 2.5,
                      flexDirection: 'column',
                      opacity: creatininabtn === 1 ? 1 : 0.6,
                      padding: 10,
                    }}
                  >
                    CREATININA
                  </button>
                  <button
                    className="blue-button"
                    onClick={() => clickSodio()}
                    style={{
                      width: window.innerWidth > 400 ? '32%' : '45%',
                      height: window.innerWidth > 400 ? '40%' : '35%',
                      margin: 2.5,
                      flexDirection: 'column',
                      opacity: sodiobtn === 1 ? 1 : 0.6,
                      padding: 10,
                    }}
                  >
                    SÓDIO
                  </button>
                  <button
                    className="blue-button"
                    onClick={() => clickPotassio()}
                    style={{
                      width: window.innerWidth > 400 ? '32%' : '45%',
                      height: window.innerWidth > 400 ? '40%' : '35%',
                      margin: 2.5,
                      flexDirection: 'column',
                      opacity: potassiobtn === 1 ? 1 : 0.6,
                      padding: 10,
                    }}
                  >
                    POTÁSSIO
                  </button>
                  <button
                    className="blue-button"
                    onClick={() => clickFosforo()}
                    style={{
                      width: window.innerWidth > 400 ? '32%' : '45%',
                      height: window.innerWidth > 400 ? '40%' : '35%',
                      margin: 2.5,
                      flexDirection: 'column',
                      opacity: fosforobtn === 1 ? 1 : 0.6,
                      padding: 10,
                    }}
                  >
                    FÓSFORO
                  </button>
                  <button
                    className="blue-button"
                    onClick={() => clickMagnesio()}
                    style={{
                      width: window.innerWidth > 400 ? '32%' : '45%',
                      height: window.innerWidth > 400 ? '40%' : '35%',
                      margin: 2.5,
                      flexDirection: 'column',
                      opacity: magnesiobtn === 1 ? 1 : 0.6,
                      padding: 10,
                    }}
                  >
                    MAGNÉSIO
                  </button>
                  <button
                    className="blue-button"
                    onClick={() => clickTgo()}
                    style={{
                      width: window.innerWidth > 400 ? '32%' : '45%',
                      height: window.innerWidth > 400 ? '40%' : '35%',
                      margin: 2.5,
                      backgroundColor: '#52BE80',
                      flexDirection: 'column',
                      opacity: tgobtn === 1 ? 1 : 0.6,
                      padding: 10,
                    }}
                  >
                    TGO + TGP
                  </button>
                  <button
                    className="blue-button"
                    onClick={() => clickFal()}
                    style={{
                      width: window.innerWidth > 400 ? '32%' : '45%',
                      height: window.innerWidth > 400 ? '40%' : '35%',
                      margin: 2.5,
                      backgroundColor: '#52BE80',
                      flexDirection: 'column',
                      opacity: falbtn === 1 ? 1 : 0.6,
                      padding: 10,
                    }}
                  >
                    FOSFATASE ALCALINA
                  </button>
                  <button
                    className="blue-button"
                    onClick={() => clickGgt()}
                    style={{
                      width: window.innerWidth > 400 ? '32%' : '45%',
                      height: window.innerWidth > 400 ? '40%' : '35%',
                      margin: 2.5,
                      backgroundColor: '#52BE80',
                      flexDirection: 'column',
                      opacity: ggtbtn === 1 ? 1 : 0.6,
                      padding: 10,
                    }}
                  >
                    GAMA-GT
                  </button>
                  <button
                    className="blue-button"
                    onClick={() => clickBtf()}
                    style={{
                      width: window.innerWidth > 400 ? '32%' : '45%',
                      height: window.innerWidth > 400 ? '40%' : '35%',
                      margin: 2.5,
                      backgroundColor: '#52BE80',
                      flexDirection: 'column',
                      opacity: btfbtn === 1 ? 1 : 0.6,
                      padding: 10,
                    }}
                  >
                    BILIRRUBINA TOTAL E FRAÇÕES
                  </button>
                  <button
                    className="blue-button"
                    onClick={() => clickAmilase()}
                    style={{
                      width: window.innerWidth > 400 ? '32%' : '45%',
                      height: window.innerWidth > 400 ? '40%' : '35%',
                      margin: 2.5,
                      backgroundColor: '#52BE80',
                      flexDirection: 'column',
                      opacity: amilasebtn === 1 ? 1 : 0.6,
                      padding: 10,
                    }}
                  >
                    AMILASE
                  </button>
                  <button
                    className="blue-button"
                    onClick={() => clickTap()}
                    style={{
                      width: window.innerWidth > 400 ? '32%' : '45%',
                      height: window.innerWidth > 400 ? '40%' : '35%',
                      margin: 2.5,
                      backgroundColor: '#CD6155',
                      flexDirection: 'column',
                      opacity: tapbtn === 1 ? 1 : 0.6,
                      padding: 10,
                    }}
                  >
                    TAP + RNI
                  </button>
                  <button
                    className="blue-button"
                    onClick={() => clickPtt()}
                    style={{
                      width: window.innerWidth > 400 ? '32%' : '45%',
                      height: window.innerWidth > 400 ? '40%' : '35%',
                      margin: 2.5,
                      backgroundColor: '#CD6155',
                      flexDirection: 'column',
                      opacity: pttbtn === 1 ? 1 : 0.6,
                      padding: 10,
                    }}
                  >
                    PTT
                  </button>
                  <button
                    className="blue-button"
                    onClick={() => clickHemoc1()}
                    style={{
                      width: window.innerWidth > 400 ? '32%' : '45%',
                      height: window.innerWidth > 400 ? '40%' : '35%',
                      margin: 2.5,
                      flexDirection: 'column',
                      backgroundColor: '#EB984E',
                      opacity: hemoc1btn === 1 ? 1 : 0.6,
                      padding: 10,
                    }}
                  >
                    HEMOCULTURA (1a AMOSTRA)
                  </button>
                  <button
                    className="blue-button"
                    onClick={() => clickHemoc2()}
                    style={{
                      width: window.innerWidth > 400 ? '32%' : '45%',
                      height: window.innerWidth > 400 ? '40%' : '35%',
                      margin: 2.5,
                      flexDirection: 'column',
                      backgroundColor: '#EB984E',
                      opacity: hemoc2btn === 1 ? 1 : 0.6,
                      padding: 10,
                    }}
                  >
                    HEMOCULTURA (2a AMOSTRA)
                  </button>
                  <button
                    className="blue-button"
                    onClick={() => clickHemoc3()}
                    style={{
                      width: window.innerWidth > 400 ? '32%' : '45%',
                      height: window.innerWidth > 400 ? '40%' : '35%',
                      margin: 2.5,
                      flexDirection: 'column',
                      backgroundColor: '#EB984E',
                      opacity: hemoc3btn === 1 ? 1 : 0.6,
                      padding: 10,
                    }}
                  >
                    HEMOCULTURA (3a AMOSTRA)
                  </button>
                  <button
                    className="blue-button"
                    onClick={() => clickUroc()}
                    style={{
                      width: window.innerWidth > 400 ? '32%' : '45%',
                      height: window.innerWidth > 400 ? '40%' : '35%',
                      margin: 2.5,
                      flexDirection: 'column',
                      backgroundColor: '#EB984E',
                      opacity: urocbtn === 1 ? 1 : 0.6,
                      padding: 10,
                    }}
                  >
                    UROCULTURA
                  </button>
                  <button
                    className="blue-button"
                    onClick={() => clickMinibal()}
                    style={{
                      width: window.innerWidth > 400 ? '32%' : '45%',
                      height: window.innerWidth > 400 ? '40%' : '35%',
                      margin: 2.5,
                      flexDirection: 'column',
                      backgroundColor: '#EB984E',
                      opacity: minibalbtn === 1 ? 1 : 0.6,
                      padding: 10,
                    }}
                  >
                    ASPIRADO TRAQUEAL
                  </button>
                </div>
              </div>
              <ShowSearchLab></ShowSearchLab>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
}
export default Laboratorio;