import React, { useState, useContext } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import Context from '../Context';
import { useHistory } from "react-router-dom";
import useInterval from 'react-useinterval';

function EscalasAssistenciais() {

  var htmlghapinsertescala = process.env.REACT_APP_API_CLONE_INSERTESCALA;
  // recuperando estados globais (Context.API).
  const {
    showescala, setshowescala,
    idatendimento, idpaciente,
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
            className="corpo">
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
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
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
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
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
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
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
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
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
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
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
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
      <div className="menucover" style={{ zIndex: 9, display: showescala == 2 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
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
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
              <div className="title2" style={{ fontSize: 14, width: 150, textAlign: 'center' }}>FORÇA MUSCULAR:</div>
              <button
                onClick={() => { setgrau(5) }}
                className={grau === 5 ? "red-button" : "blue-button"}
                style={{ width: 150, padding: 10 }}>
                NORMAL
              </button>
              <button
                onClick={() => { setgrau(4) }}
                className={grau === 4 ? "red-button" : "blue-button"}
                style={{ width: 150, padding: 10 }}>
                BOA
              </button>
              <button
                onClick={() => { setgrau(3) }}
                className={grau === 3 ? "red-button" : "blue-button"}
                style={{ width: 150, padding: 10 }}>
                REGULAR
              </button>
              <button
                onClick={() => { setgrau(2) }}
                className={grau === 2 ? "red-button" : "blue-button"}
                style={{ width: 150, padding: 10 }}>
                FRACA
              </button>
              <button
                onClick={() => { setgrau(1) }}
                className={grau === 1 ? "red-button" : "blue-button"}
                style={{ width: 150, padding: 10 }}>
                MÍNIMA
              </button>
              <button
                onClick={() => { setgrau(0) }}
                className={grau === 0 ? "red-button" : "blue-button"}
                style={{ width: 150, padding: 10 }}>
                AUSENTE
              </button>
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
      cd_escala: 3,
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
      <div className="menucover" style={{ zIndex: 9, display: showescala == 2 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
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
          <div
            className="corpo">
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: 5 }}>
              <div className="title2" style={{ fontSize: 14, width: 150, textAlign: 'center' }}>FORÇA MUSCULAR:</div>
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
                style={{ width: 150, padding: 10 }}>
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
    );
  }

  return (
    <div>
      <Braden></Braden>
      <Morse></Morse>
      <Oxford></Oxford>
    </div>
  )
}

export default Prontuario;