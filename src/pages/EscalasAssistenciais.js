import React, { useState, useContext } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import Context from '../Context';
import { useHistory } from "react-router-dom";
import useInterval from 'react-useinterval';
import deletar from '../images/deletar.svg';
import suspender from '../images/suspender.svg';
import editar from '../images/editar.svg';
import salvar from '../images/salvar.svg';

function EscalasAssistenciais() {

  var htmlghapinsertescala = process.env.REACT_APP_API_CLONE_INSERTESCALA;
  // recuperando estados globais (Context.API).
  const {
    idatendimento, idpaciente,
    showescala, setshowescala,
  } = useContext(Context)

  // ESCALA DE BRADEN (showescala = 1).
  const [percepcao, setpercepcao] = useState(4);
  const [umidade, setumidade] = useState(4);
  const [atividade, setatividade] = useState(4);
  const [mobilidade, setmobilidade] = useState(4);
  const [nutricao, setnutricao] = useState(4);
  const [friccao, setfriccao] = useState(3);
  const insertBraden = () => {
    var valor = percepcao + umidade + atividade + mobilidade + nutricao + friccao;
    var significado = '';
    if (valor > 14) {
      significado = 'RISCO BAIXO';
    } else if (valor > 12 && valor < 15) {
      significado = 'RISCO MODERADO';
    } else if (valor > 9 && valor < 13) {
      significado = 'RISCO MUITO ALTO'
    }
    var obj = {
      idpct: idpaciente,
      idatendimento: idatendimento,
      data: moment(),
      cd_escala: 1,
      ds_escala: 'BRADEN',
      valor_resultado: valor,
      ds_resultado: significado,
      idprofissional: 0,
      status: 1,
    }
    axios.post(htmlghapinsertescala, obj).then(() => {
      setshowescala(0);
    })
  }
  function Braden() {
    return (
      <div className="menucover" style={{ zIndex: 9, display: showescala == 1 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div className="menucontainer">
          <div id="cabeçalho" className="cabecalho">
            <div className="title5">{'ESCALA DE BRADEN'}</div>
            <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <button className="red-button" onClick={() => setshowescala(0)}>
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
                onClick={() => insertBraden()}
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
            className="corpo" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', alignItems: 'flex-start' }}>
            <div className="scroll">
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
                <div className="title2" style={{ fontSize: 14, width: 150, textAlign: 'center' }}>PERCEPÇÃO SENSORIAL:</div>
                <button
                  onClick={() => { setpercepcao(1) }}
                  className={percepcao === 1 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  TOTALMENTE LIMITADO
                </button>
                <button
                  onClick={() => { setpercepcao(2) }}
                  className={percepcao === 2 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  MUITO LIMITADO
                </button>
                <button
                  onClick={() => { setpercepcao(3) }}
                  className={percepcao === 3 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  LEVEMENTE LIMITADO
                </button>
                <button
                  onClick={() => { setpercepcao(4) }}
                  className={percepcao === 4 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  NENHUMA LIMITAÇÃO
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
                <div className="title2" style={{ fontSize: 14, width: 150, textAlign: 'center', alignSelf: 'center' }}>UMIDADE:</div>
                <button
                  onClick={() => { setumidade(1) }}
                  className={umidade === 1 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  COMPLETAMENTE MOLHADO
                </button>
                <button
                  onClick={() => { setumidade(2) }}
                  className={umidade === 2 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  MUITO MOLHADO
                </button>
                <button
                  onClick={() => { setumidade(3) }}
                  className={umidade === 3 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  OCASIONALMENTE MOLHADO
                </button>
                <button
                  onClick={() => { setumidade(4) }}
                  className={umidade === 4 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  RARAMENTE MOLHADO
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
                <div className="title2" style={{ fontSize: 14, width: 150, textAlign: 'center', alignSelf: 'center' }}>ATIVIDADE:</div>
                <button
                  onClick={() => { setatividade(1) }}
                  className={atividade === 1 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  ACAMADO
                </button>
                <button
                  onClick={() => { setatividade(2) }}
                  className={atividade === 2 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  CONFINADO À CADEIRA
                </button>
                <button
                  onClick={() => { setatividade(3) }}
                  className={atividade === 3 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  ANDA OCASIONALMENTE
                </button>
                <button
                  onClick={() => { setatividade(4) }}
                  className={atividade === 4 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  ANDA FREQUENTEMENTE
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
                <div className="title2" style={{ fontSize: 14, width: 150, textAlign: 'center', alignSelf: 'center' }}>MOBILIDADE:</div>
                <button
                  onClick={() => { setmobilidade(1) }}
                  className={mobilidade === 1 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  TOTALMENTE LIMITADO
                </button>
                <button
                  onClick={() => { setmobilidade(2) }}
                  className={mobilidade === 2 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  BASTANTE LIMITADO
                </button>
                <button
                  onClick={() => { setmobilidade(3) }}
                  className={mobilidade === 3 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  LEVEMENTE LIMITADO
                </button>
                <button
                  onClick={() => { setmobilidade(4) }}
                  className={mobilidade === 4 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  NÃO APRESENTA LIMITAÇÕES
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
                <div className="title2" style={{ fontSize: 14, width: 150, textAlign: 'center', alignSelf: 'center' }}>NUTRIÇÃO:</div>
                <button
                  onClick={() => { setnutricao(1) }}
                  className={nutricao === 1 ? "red-button" : "blue-button"}
                  style={{ width: 150 }}>
                  MUITO POBRE
                </button>
                <button
                  onClick={() => { setnutricao(2) }}
                  className={nutricao === 2 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  PROVAVELMENTE INADEQUADA
                </button>
                <button
                  onClick={() => { setnutricao(3) }}
                  className={nutricao === 3 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  ADEQUADA
                </button>
                <button
                  onClick={() => { setnutricao(4) }}
                  className={nutricao === 4 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  EXCELENTE
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
                <div className="title2" style={{ fontSize: 14, width: 150, textAlign: 'center', alignSelf: 'center' }}>FRICÇÃO E CISALHAMENTO:</div>
                <button
                  onClick={() => { setfriccao(1) }}
                  className={friccao === 1 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  PROBLEMA
                </button>
                <button
                  onClick={() => { setfriccao(2) }}
                  className={friccao === 2 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  PROBLEMA POTENCIAL
                </button>
                <button
                  onClick={() => { setfriccao(3) }}
                  className={friccao === 3 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  NENHUM PROBLEMA
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ESCALA DE MORSE (showescala = 2).
  const [quedas, setquedas] = useState(0);
  const [diagsec, setdiagsec] = useState(0);
  const [auxilio, setauxilio] = useState(0);
  const [endovenosa, setendovenosa] = useState(0);
  const [marcha, setmarcha] = useState(0);
  const [mental, setmental] = useState(0);
  const insertMorse = () => {
    var valor = quedas + diagsec + auxilio + endovenosa + marcha + mental;
    var significado = '';
    if (valor < 41) {
      significado = 'RISCO MÉDIO';
    } else if (valor > 40 && valor < 52) {
      significado = 'RISCO ELEVADO';
    } else if (valor > 51) {
      significado = 'RISCO MUITO ELEVADO'
    }
    var obj = {
      idpct: idpaciente,
      idatendimento: idatendimento,
      data: moment(),
      cd_escala: 2,
      ds_escala: 'MORSE',
      valor_resultado: valor,
      ds_resultado: significado,
      idprofissional: 0,
      status: 1,
    }
    axios.post(htmlghapinsertescala, obj).then(() => {
      setshowescala(0);
    })
  }
  function Morse() {
    return (
      <div className="menucover" style={{ zIndex: 9, display: showescala == 2 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div className="menucontainer">
          <div id="cabeçalho" className="cabecalho">
            <div className="title5">{'ESCALA DE MORSE'}</div>
            <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <button className="red-button" onClick={() => setshowescala(0)}>
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
                onClick={() => insertMorse()}
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
            <div className="scroll" style={{ height: '60vh' }}>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
                <div className="title2" style={{ fontSize: 14, width: 150, textAlign: 'center', alignSelf: 'center' }}>HISTÓRICO DE QUEDAS:</div>
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
                <div className="title2" style={{ fontSize: 14, width: 150, textAlign: 'center', alignSelf: 'center' }}>DIAGNÓSTICO SECUNDÁRIO:</div>
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
                <div className="title2" style={{ fontSize: 14, width: 150, textAlign: 'center', alignSelf: 'center' }}>AUXÍLIO NA DEAMBULAÇÃO:</div>
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
                <div className="title2" style={{ fontSize: 14, width: 150, textAlign: 'center', alignSelf: 'center' }}>TERAPIA ENDOVENOSA OU CATETER VENOSO:</div>
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
                <div className="title2" style={{ fontSize: 14, width: 150, textAlign: 'center', alignSelf: 'center' }}>MARCHA:</div>
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
                <div className="title2" style={{ fontSize: 14, width: 150, textAlign: 'center', alignSelf: 'center' }}>ESTADO MENTAL:</div>
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
      </div>
    );
  }

  // ESCALA DE OXFORD (showescala = 3).
  const [grau, setgrau] = useState(0);
  const insertOxford = () => {
    var significado = '';
    if (grau == 0) {
      significado = 'AUSENTE';
    } else if (grau == 1) {
      significado = 'MÍNIMA';
    } else if (grau == 2) {
      significado = 'FRACA';
    } else if (grau == 3) {
      significado = 'REGULAR';
    } else if (grau == 4) {
      significado = 'BOA';
    } else if (grau == 5) {
      significado = 'NORMAL';
    }
    var obj = {
      idpct: idpaciente,
      idatendimento: idatendimento,
      data: moment(),
      cd_escala: 3,
      ds_escala: 'OXFORD',
      valor_resultado: grau,
      ds_resultado: significado,
      idprofissional: 0,
      status: 1,
    }
    axios.post(htmlghapinsertescala, obj).then(() => {
      setshowescala(0);
    })
  }
  function Oxford() {
    return (
      <div className="menucover" style={{ zIndex: 9, display: showescala == 3 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div className="menucontainer">
          <div id="cabeçalho" className="cabecalho">
            <div className="title5">{'ESCALA DE OXFORD'}</div>
            <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <button className="red-button" onClick={() => setshowescala(0)}>
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
                onClick={() => insertOxford()}
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
            <div className="title2" style={{ fontSize: 14, width: 150, textAlign: 'center', alignSelf: 'center' }}>FORÇA MUSCULAR:</div>
            <div className="scroll" style={{ height: '60vh', paddingRight: 10 }}>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginBottom: 5 }}>
                <button
                  onClick={() => { setgrau(5) }}
                  className={grau === 5 ? "red-button" : "blue-button"}
                  style={{ padding: 10 }}>
                  NORMAL
                </button>
                <button
                  onClick={() => { setgrau(4) }}
                  className={grau === 4 ? "red-button" : "blue-button"}
                  style={{ padding: 10 }}>
                  BOA
                </button>
                <button
                  onClick={() => { setgrau(3) }}
                  className={grau === 3 ? "red-button" : "blue-button"}
                  style={{ padding: 10 }}>
                  REGULAR
                </button>
                <button
                  onClick={() => { setgrau(2) }}
                  className={grau === 2 ? "red-button" : "blue-button"}
                  style={{ padding: 10 }}>
                  FRACA
                </button>
                <button
                  onClick={() => { setgrau(1) }}
                  className={grau === 1 ? "red-button" : "blue-button"}
                  style={{ padding: 10 }}>
                  MÍNIMA
                </button>
                <button
                  onClick={() => { setgrau(0) }}
                  className={grau === 0 ? "red-button" : "blue-button"}
                  style={{ padding: 10 }}>
                  AUSENTE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ESCALA DE FOIS (showescala = 4).
  const [nivel, setnivel] = useState(0);
  const insertFois = () => {
    var significado = '';
    if (nivel == 1) {
      significado = 'NADA POR VIA ORAL.';
    } else if (nivel == 2) {
      significado = 'DEPENDÊNCIA DE VIA ALTERNATIVA, MÍNIMA OFERTA DE VIA ORAL (ESTÍMULO GUSTATIVO).';
    } else if (nivel == 3) {
      significado = 'DEPENDÊNCIA DE VIA ALTERNATIVA, OFERTA DE UMA ÚNICA CONSISTÊNCIA POR VIA ORAL.';
    } else if (nivel == 4) {
      significado = 'VIA ORAL TOTAL, LIMITADA A UMA ÚNICA CONSISTÊNCIA.';
    } else if (nivel == 5) {
      significado = 'VIA ORAL TOTAL, COM MAIS DE UMA CONSISTÊNCIA, NECESSITANDO PREPARO ESPECIAL.';
    } else if (nivel == 6) {
      significado = 'VIA ORAL TOTAL, MAIS DE UMA CONSISTÊNCIA, LIMITAÇÕES OU RESTRIÇÕES ESPECÍFICAS.';
    } else {
      significado = 'VIA ORAL TOTAL, SEM RESTRIÇÕES';
    }
    var obj = {
      idpct: idpaciente,
      idatendimento: idatendimento,
      data: moment(),
      cd_escala: 4,
      ds_escala: 'FOIS',
      valor_resultado: nivel,
      ds_resultado: significado,
      idprofissional: 0,
      status: 1,
    }
    axios.post(htmlghapinsertescala, obj).then(() => {
      setshowescala(0);
    })
  }
  function Fois() {
    return (
      <div className="menucover" style={{ zIndex: 9, display: showescala == 4 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div className="menucontainer">
          <div id="cabeçalho" className="cabecalho">
            <div className="title5">{'ESCALA DE FOIS'}</div>
            <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <button className="red-button" onClick={() => setshowescala(0)}>
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
                onClick={() => insertFois()}
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
          <div>
            <div
              className="corpo">
              <div
                className="scroll"
                style={{
                  display: 'flex', flexDirection: 'row', justifyContent: 'center',
                  marginBottom: 5, flexWrap: 'wrap',
                  width: '60vw', height: '50vh'
                }}>
                <button
                  onClick={() => { setnivel(1) }}
                  className={nivel === 1 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  NADA POR VIA ORAL
                </button>
                <button
                  onClick={() => { setnivel(2) }}
                  className={nivel === 2 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  DEPENDÊNCIA DE VIA ALTERNATIVA, MÍNIMA OFERTA DE VIA ORAL (ESTÍMULO GUSTATIVO).
                </button>
                <button
                  onClick={() => { setnivel(3) }}
                  className={nivel === 3 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  DEPENDÊNCIA DE VIA ALTERNATIVA, OFERTA DE UMA ÚNICA CONSISTÊNCIA POR VIA ORAL.
                </button>
                <button
                  onClick={() => { setnivel(4) }}
                  className={nivel === 4 ? "red-button" : "blue-button"}
                  style={{ width: 150, height: 150, minHeight: 150, padding: 10 }}>
                  VIA ORAL TOTAL, LIMITADA A UMA ÚNICA CONSISTÊNCIA.
                </button>
                <button
                  onClick={() => { setnivel(5) }}
                  className={nivel === 5 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  VIA ORAL TOTAL, MAIS DE UMA CONSISTÊNCIA, NECESSITANDO PREPARO ESPECIAL.
                </button>
                <button
                  onClick={() => { setnivel(6) }}
                  className={nivel === 6 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  VIA ORAL TOTAL, MAIS DE UMA CONSISTÊNCIA, LIMITAÇÕES OU RESTRIÇÕES ESPECÍFICAS.
                </button>
                <button
                  onClick={() => { setnivel(7) }}
                  className={nivel === 7 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  VIA ORAL TOTAL, SEM RESTRIÇÕES.
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ESCALA DE FUGULIN (showescala = 5).
  const [estadomental, setestadomental] = useState(1);
  const [oxigenacao, setoxigenacao] = useState(1);
  const [sinaisvitais, setsinaisvitais] = useState(1);
  const [motilidade, setmotilidade] = useState(1);
  const [deambulacaofugulin, setdeambulacaofugulin] = useState(1);
  const [alimentacao, setalimentacao] = useState(1);
  const [cuidadocorporal, setcuidadocorporal] = useState(1);
  const [eliminacao, seteliminacao] = useState(1);
  const [terapeutica, setterapeutica] = useState(0);
  const insertFugulin = () => {
    var valor = estadomental + oxigenacao + sinaisvitais + motilidade + deambulacao + alimentacao + cuidadocorporal + eliminacao + terapeutica;
    var significado = '';
    if (valor < 18) {
      significado = 'CUIDADO MÍNIMO';
    } else if (valor > 17 && valor < 23) {
      significado = 'CUIDADO INTERMEDIÁRIO';
    } else if (valor > 22 && valor < 28) {
      significado = 'ALTA DEPENDÊNCIA';
    } else {
      significado = 'CUIDADO SEMI-INTENSIVO';
    }
    var obj = {
      idpct: idpaciente,
      idatendimento: idatendimento,
      data: moment(),
      cd_escala: 5,
      ds_escala: 'FUGULIN',
      valor_resultado: valor,
      ds_resultado: significado,
      idprofissional: 0,
      status: 1,
    }
    axios.post(htmlghapinsertescala, obj).then(() => {
      setshowescala(0);
    })
  }
  function Fugulin() {
    return (
      <div className="menucover" style={{ zIndex: 9, display: showescala == 5 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div className="menucontainer">
          <div id="cabeçalho" className="cabecalho">
            <div className="title5">{'ESCALA DE FUGULIN'}</div>
            <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <button className="red-button" onClick={() => setshowescala(0)}>
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
                onClick={() => insertFugulin()}
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
            <div className="scroll" style={{ height: '60vh' }}>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
                <div className="title2" style={{ fontSize: 14, width: 150, textAlign: 'center', alignSelf: 'center' }}>ESTADO MENTAL:</div>
                <button
                  onClick={() => { setestadomental(4) }}
                  className={estadomental === 4 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  INCONSCIENTE
                </button>
                <button
                  onClick={() => { setestadomental(3) }}
                  className={estadomental === 3 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  PERÍODOS DE INCONSCIÊNCIA
                </button>
                <button
                  onClick={() => { setestadomental(2) }}
                  className={estadomental === 2 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  PERÍODOS DE DESORIENTAÇÃO NO TEMPO E NO ESPAÇO
                </button>
                <button
                  onClick={() => { setestadomental(1) }}
                  className={estadomental === 1 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  ORIENTADO NO TEMPO E NO ESPAÇO
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
                <div className="title2" style={{ fontSize: 14, width: 150, textAlign: 'center', alignSelf: 'center' }}>OXIGENAÇÃO:</div>
                <button
                  onClick={() => { setoxigenacao(4) }}
                  className={oxigenacao === 4 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  VENTILAÇÃO MECÂNICA
                </button>
                <button
                  onClick={() => { setoxigenacao(3) }}
                  className={oxigenacao === 3 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  USO CONTÍNUO DE MÁSCARA OU CN
                </button>
                <button
                  onClick={() => { setoxigenacao(2) }}
                  className={oxigenacao === 2 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  USO INTERMITENTE DE MÁSCARA OU CN
                </button>
                <button
                  onClick={() => { setoxigenacao(1) }}
                  className={oxigenacao === 1 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  NÃO DEPENDE DE OXIGÊNIO
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
                <div className="title2" style={{ fontSize: 14, width: 150, textAlign: 'center', alignSelf: 'center' }}>SINAIS VITAIS:</div>
                <button
                  onClick={() => { setsinaisvitais(4) }}
                  className={sinaisvitais === 4 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  CONTROLES EM INTERVALOS DE 2H OU MENOS
                </button>
                <button
                  onClick={() => { setsinaisvitais(3) }}
                  className={sinaisvitais === 3 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  CONTROLES EM INTERVALOS DE 4H
                </button>
                <button
                  onClick={() => { setsinaisvitais(2) }}
                  className={sinaisvitais === 2 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  CONTROLES EM INTERVALOS DE 6H
                </button>
                <button
                  onClick={() => { setsinaisvitais(1) }}
                  className={sinaisvitais === 1 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  CONTROLES EM INTERVALOS MAIORES OU IGUAIS A 8H
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
                <div className="title2" style={{ fontSize: 14, width: 150, textAlign: 'center', alignSelf: 'center' }}>MOTILIDADE:</div>
                <button
                  onClick={() => { setmotilidade(4) }}
                  className={mobilidade === 4 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  INCAPAZ DE SE MOVIMENTAR
                </button>
                <button
                  onClick={() => { setmotilidade(3) }}
                  className={mobilidade === 3 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  DIFICULDADE PARA MOVIMENTAR
                </button>
                <button
                  onClick={() => { setmotilidade(2) }}
                  className={mobilidade === 2 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  LIMITAÇÃO DE MOVIMENTOS
                </button>
                <button
                  onClick={() => { setmotilidade(1) }}
                  className={mobilidade === 4 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  MOVIMENTA TODOS OS SEGMENTOS CORPORAIS
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
                <div className="title2" style={{ fontSize: 14, width: 150, textAlign: 'center', alignSelf: 'center' }}>DEAMBULAÇÃO:</div>
                <button
                  onClick={() => { setdeambulacaofugulin(4) }}
                  className={deambulacao === 4 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  RESTRITO AO LEITO
                </button>
                <button
                  onClick={() => { setdeambulacaofugulin(3) }}
                  className={deambulacao === 3 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  LOCOMOÇÃO ATRAVÉS DE CADEIRA DE RODAS
                </button>
                <button
                  onClick={() => { setdeambulacaofugulin(2) }}
                  className={deambulacao === 2 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  AUXÍLIO PARA DEAMBULAR
                </button>
                <button
                  onClick={() => { setdeambulacaofugulin(1) }}
                  className={deambulacao === 1 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  AMBULANTE
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
                <div className="title2" style={{ fontSize: 14, width: 150, textAlign: 'center', alignSelf: 'center' }}>ALIMENTAÇÃO:</div>
                <button
                  onClick={() => { setalimentacao(4) }}
                  className={alimentacao === 4 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  ATRAVÉS DE CATETER CENTRAL (NPT)
                </button>
                <button
                  onClick={() => { setalimentacao(3) }}
                  className={alimentacao === 3 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  ATRAVÉS DE SONDA NASOGÁSTRICA
                </button>
                <button
                  onClick={() => { setalimentacao(2) }}
                  className={alimentacao === 2 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  POR BOCA COM AUXÍLIO
                </button>
                <button
                  onClick={() => { setalimentacao(1) }}
                  className={alimentacao === 1 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  AUTO-SUFICIENTE
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
                <div className="title2" style={{ fontSize: 14, width: 150, textAlign: 'center', alignSelf: 'center' }}>CUIDADO CORPORAL:</div>
                <button
                  onClick={() => { setcuidadocorporal(4) }}
                  className={cuidadocorporal === 4 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  BANHO NO LEITO
                </button>
                <button
                  onClick={() => { setcuidadocorporal(3) }}
                  className={cuidadocorporal === 3 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  BANHO DE CHUVEIRO, HIGIENE ORAL FEITA PELA ENFERMAGEM
                </button>
                <button
                  onClick={() => { setcuidadocorporal(2) }}
                  className={cuidadocorporal === 2 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  AUXÍLIO NO BANHO DE CHUVEIRO E NA HIGIENE ORAL
                </button>
                <button
                  onClick={() => { setcuidadocorporal(1) }}
                  className={cuidadocorporal === 1 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  AUTO-SUFICIENTE
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
                <div className="title2" style={{ fontSize: 14, width: 150, textAlign: 'center', alignSelf: 'center' }}>ELIMINAÇÃO:</div>
                <button
                  onClick={() => { seteliminacao(4) }}
                  className={eliminacao === 4 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  BANHO NO LEITO
                </button>
                <button
                  onClick={() => { seteliminacao(3) }}
                  className={eliminacao === 3 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  BANHO DE CHUVEIRO, HIGIENE ORAL FEITA PELA ENFERMAGEM
                </button>
                <button
                  onClick={() => { seteliminacao(2) }}
                  className={eliminacao === 2 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  AUXÍLIO NO BANHO DE CHUVEIRO E NA HIGIENE ORAL
                </button>
                <button
                  onClick={() => { seteliminacao(1) }}
                  className={eliminacao === 1 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  AUTO-SUFICIENTE
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
                <div className="title2" style={{ fontSize: 14, width: 150, textAlign: 'center', alignSelf: 'center' }}>TERAPÊUTICA:</div>
                <button
                  onClick={() => { setterapeutica(4) }}
                  className={terapeutica === 4 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  USO DE DROGAS VASOATIVAS
                </button>
                <button
                  onClick={() => { setterapeutica(3) }}
                  className={terapeutica === 3 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  EV CONTÍNUA OU POR SONDA NASOGÁSTRICA
                </button>
                <button
                  onClick={() => { setterapeutica(2) }}
                  className={terapeutica === 2 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  EV INTERMITENTE
                </button>
                <button
                  onClick={() => { setterapeutica(1) }}
                  className={terapeutica === 1 ? "red-button" : "blue-button"}
                  style={{ width: 150, padding: 10 }}>
                  INTRAMUSCULAR OU VIA ORAL
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ESCALA DE BARTHEL (showescala = 6).
  const [higienepessoal, sethigienepessoal] = useState(0);
  const [banho, setbanho] = useState(0);
  const [alimentacaobarthel, setalimentacaobarthel] = useState(0);
  const [toalete, settoalete] = useState(0);
  const [escadas, setescadas] = useState(0);
  const [vestir, setvestir] = useState(0);
  const [urina, seturina] = useState(0);
  const [intestino, setintestino] = useState(0);
  const [deambulacao, setdeambulacao] = useState(0);
  const [cadeiraderodas, setcadeiraderodas] = useState(0);
  const [transferencia, settransferencia] = useState(0);

  const insertBarthel = () => {
    var valor = higienepessoal + banho + alimentacaobarthel + toalete +
      escadas + vestir + urina + intestino + deambulacao + cadeiraderodas + transferencia;
    var significado = '';
    if (valor < 20) {
      significado = 'DEPENDÊNCIA TOTAL';
    } else if (valor > 19 && valor < 36) {
      significado = 'DEPENDÊNCIA GRAVE';
    } else if (valor > 39 && valor < 56) {
      significado = 'DEPENDÊNCIA MODERADA';
    } else {
      significado = 'DEPENDÊNCIA LEVE';
    }
    var obj = {
      idpct: idpaciente,
      idatendimento: idatendimento,
      data: moment(),
      cd_escala: 5,
      ds_escala: 'BARTHEL',
      valor_resultado: valor,
      ds_resultado: significado,
      idprofissional: 0,
      status: 1,
    }
    axios.post(htmlghapinsertescala, obj).then(() => {
      setshowescala(0);
    })
  }

  function Barthel() {
    return (
      <div className="menucover" style={{ zIndex: 9, display: showescala == 6 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div className="menucontainer">
          <div id="cabeçalho" className="cabecalho">
            <div className="title5">{'ÍNDICE DE BARTHEL'}</div>
            <div id="botões" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <button className="red-button" onClick={() => setshowescala(0)}>
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
                onClick={() => insertBarthel()}
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
              <div className="title2" style={{ fontSize: 14, width: 150, textAlign: 'center', alignSelf: 'center' }}>HIGIENE PESSOAL:</div>
              <button
                onClick={() => { sethigienepessoal(1) }}
                className={estadomental === 4 ? "red-button" : "blue-button"}
                style={{ width: 150, padding: 10 }}>
                TOTALMENTE DEPENDENTE
              </button>
              <button
                onClick={() => { sethigienepessoal(2) }}
                className={estadomental === 4 ? "red-button" : "blue-button"}
                style={{ width: 150, padding: 10 }}>
                ASSISTÊNCIA EM TODOS OS PASSOS
              </button>
              <button
                onClick={() => { sethigienepessoal(3) }}
                className={estadomental === 4 ? "red-button" : "blue-button"}
                style={{ width: 150, padding: 10 }}>
                ASSISTÊNCIA EM UM OU MAIS PASSOS
              </button>
              <button
                onClick={() => { sethigienepessoal(4) }}
                className={estadomental === 4 ? "red-button" : "blue-button"}
                style={{ width: 150, padding: 10 }}>
                MÍNIMA ASSISTÊNCIA
              </button>
              <button
                onClick={() => { sethigienepessoal(5) }}
                className={estadomental === 4 ? "red-button" : "blue-button"}
                style={{ width: 150, padding: 10 }}>
                SEM ASSISTÊNCIA
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
              <div className="title2" style={{ fontSize: 14, width: 150, textAlign: 'center', alignSelf: 'center' }}>BANHO:</div>
              <button
                onClick={() => { setbanho(1) }}
                className={estadomental === 4 ? "red-button" : "blue-button"}
                style={{ width: 150, padding: 10 }}>
                TOTALMENTE DEPENDENTE.
              </button>
              <button
                onClick={() => { setbanho(2) }}
                className={estadomental === 4 ? "red-button" : "blue-button"}
                style={{ width: 150, padding: 10 }}>
                ASSISTÊNCIA EM TODOS OS ASPECTOS DO BANHO
              </button>
              <button
                onClick={() => { setbanho(3) }}
                className={estadomental === 4 ? "red-button" : "blue-button"}
                style={{ width: 150, padding: 10 }}>
                ASSISTÊNCIA PARA TRANSFERÊNCIA, LAVAR-SE OU SECAR-SE
              </button>
              <button
                onClick={() => { setbanho(4) }}
                className={estadomental === 4 ? "red-button" : "blue-button"}
                style={{ width: 150, padding: 10 }}>
                SUPERVISÃO POR SEGURANÇA
              </button>
              <button
                onClick={() => { setbanho(5) }}
                className={estadomental === 4 ? "red-button" : "blue-button"}
                style={{ width: 150, padding: 10 }}>
                SEM ASSISTÊNCIA
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Braden></Braden>
      <Morse></Morse>
      <Oxford></Oxford>
      <Fois></Fois>
      <Fugulin></Fugulin>
    </div>
  )
}

export default EscalasAssistenciais;