/* eslint eqeqeq: "off" */
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import deletar from '../images/deletar.svg';
import salvar from '../images/salvar.svg';
import moment from 'moment';
import 'moment/locale/pt-br';
import Context from '../Context';

function AptEscalaIVCF({ viewescalaivcf }) {
  // recuperando estados globais (Context.API).
  const {
    idatendimento
  } = useContext(Context)
  var html = 'https://pulsarapp-server.herokuapp.com';

  const [data, setdata] = useState(moment().format('DD/MM/YYYY'));
  const [percepcaosaude, setpercepcaosaude] = useState(0);
  const [fazercompras, setfazercompras] = useState(0);
  const [pagarcontas, setpagarcontas] = useState(0);
  const [trabalhosdomesticos, settrabalhosdomesticos] = useState(0);

  const [banhosozinho, setbanhosozinho] = useState(0);

  const [esquecimentofamilia, setesquecimentofamilia] = useState(0);
  const [pioraesquecimento, setpioraesquecimento] = useState(0);
  const [esquecimentocotidiano, setesquecimentocotidiano] = useState(0);

  const [desanimo, setdesanimo] = useState(0);
  const [anedonia, setanedonia] = useState(0);

  const [elevammss, setelevammss] = useState(0);
  const [pinca, setpinca] = useState(0);
  const [perdapeso, setperdapeso] = useState(0);
  const [imc, setimc] = useState(0);
  const [panturrilhas, setpanturrilhas] = useState(0);
  const [velocidade, setvelocidade] = useState(0);
  const [marcha, setmarcha] = useState(0);
  const [quedas, setquedas] = useState(0);
  const [incontinencia, setincontinencia] = useState(0);

  const [visao, setcvisao] = useState(0);
  const [audicao, setaudicao] = useState(0);

  const [polipatologia, setpolipatologia] = useState(0);
  const [polifarmacia, setpolifarmacia] = useState(0);
  const [internacao, setinternacao] = useState(0);


  const [valor, setvalor] = useState('100%');

  // crud.
  const [listaIVCF, setlistaIVCF] = useState([])
  const loadIVCF = () => {
    axios.get(html + "/ivcf").then((response) => {
      var x = [0, 1];
      x = response.data;
      setlistaIVCF(x.filter(item => item.idatendimento == idatendimento));
    });
  }

  const selectIVCF = (item) => {
    setdata(item.data);
    // ...
  }

  const createIVCF = () => {
    var obj = {
      idatendimento: idatendimento,
      data: data,
      // ...
    }
    axios.post(html + '/createivcf', obj).then(() => {
    });
  }

  const updateIVCF = (item) => {
    var obj = {
      idatendimento: idatendimento,
      data: data,
      // ...
    }
    axios.post(html + '/updateivcf/' + item.id, obj).then(() => {
    });
  }

  const deleteIVCF = (item) => {
    axios.get(html + "/deleteivcf/'" + item.id + "'").then(() => {
    });
  }

  // lista de registros da escala.
  function ListaIVCF() {
    return (
      <div className="scroll">
        {listaIVCF.map(item => (
          <div className="row">
            <button onClick={() => selectIVCF(item)}>{item.data}</button>
          </div>
        ))}
      </div>
    )
  }

  // chave para exibi????o do componente.
  const [viewcomponent, setviewcomponent] = useState(viewescalaivcf);
  useEffect(() => {
    if (viewescalaivcf !== 0) {
      setviewcomponent(viewescalaivcf);
    } else {
    }
  }, [viewescalaivcf])

  return (
    <div className="menucover fade-in"
      style={{ zIndex: 9, display: viewcomponent == 1 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <div className="menucontainer"
        style={{ display: viewcomponent == 1 ? 'flex' : 'none' }}>
        <div id="cabe??alho" className="cabecalho">
          <div className="title5">{'IVCF'}</div>
          <div id="bot??es" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
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
            // onClick={() => insertIVCF()}
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
        <div className="corpo">
          <div className="scroll"
            style={{
              display: 'flex', flexDirection: 'column',
              backgroundColor: 'transparent', borderColor: 'transparent', height: '70vh', width: '80vw'
            }}>
            <div id="AUTO-PERCEP????O DA SA??DE" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className="title4">AUTO-PERCEP????O DA SA??DE</div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button className="blue-button" style={{ width: '13vw', padding: 10 }}>EXCELENTE, MUITO BOA OU BOA</button>
                <button className="blue-button" style={{ width: '13vw', padding: 10 }}>REGULAR OU RUIM</button>
              </div>
            </div>

            <div id="ATIVIDADES DA VIDA DI??RIA" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className="title4" style={{ marginTop: 20 }}>ATIVIDADES DE VIDA DI??RIA</div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
                <div className="title2center">AVD INSTRUMENTAL</div>
                <div id="AVD INSTRUMENTAL" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                  <button className="blue-button" style={{ width: '13vw', padding: 10 }}>DEIXOU DE FAZER COMPRAS</button>
                  <button className="blue-button" style={{ width: '13vw', padding: 10 }}>DEIXOU DE CONTROLAR O DINHEIRO E DE PAGAR CONTAS</button>
                  <button className="blue-button" style={{ width: '13vw', padding: 10 }}>DEIXOU DE REALIZAR PEQUENOS TRABALHOS DOM??STICOS</button>
                </div>
                <div className="title2center">AVD B??SICA</div>
                <button className="blue-button" style={{ width: '13vw', padding: 10 }}>DEIXOU DE TOMAR BANHO SOZINHO</button>
              </div>
            </div>

            <div className="title4" style={{ marginTop: 20 }}>COGNI????O</div>
            <div id="COGNI????O" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <button className="blue-button" style={{ width: '13vw', padding: 10 }}>ESQUECIMENTO PERCEBIDO POR FAMILIARES</button>
              <button className="blue-button" style={{ width: '13vw', padding: 10 }}>PIORA DO ESQUECIMENTO NOS ??LTIMOS MESES</button>
              <button className="blue-button" style={{ width: '13vw', padding: 10 }}>ESQUECIMENTO IMPEDE A REALIZA????O DE ATIVIDADES COTIDIANAS?</button>
            </div>

            <div className="title4" style={{ marginTop: 20 }}>HUMOR</div>
            <div id="HUMOR" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <button className="blue-button" style={{ width: '13vw', padding: 10 }}>DES??NIMO OU TRISTEZA NO ??LTIMO M??S</button>
              <button className="blue-button" style={{ width: '13vw', padding: 10 }}>PIORA DO ESQUECIMENTO NOS ??LTIMOS MESES</button>
              <button className="blue-button" style={{ width: '13vw', padding: 10 }}>ANEDONIA NO ??LTIMO M??S?</button>
            </div>

            <div className="title4" style={{ marginTop: 20 }}>MOBILIDADE</div>
            <div id="MOBILIDADE" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className="title2center" style={{ marginTop: 20 }}>ALCANCE, PREENS??O E PIN??A</div>
              <div id="ALCANCE, PREENS??O E PIN??A" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <button className="blue-button" style={{ width: '13vw', padding: 10 }}>INCAPAZ DE ELEVAR MMSS ACIMA DO OMBRO</button>
                <button className="blue-button" style={{ width: '13vw', padding: 10 }}>INCAPAZ DE MANUSEAR OU SEGURAR OBJETOS PEQUENOS?</button>
              </div>
              <div className="title2center" style={{ marginTop: 20 }}>CAPACIDADE AER??BICA E MUSCULAR</div>
              <div id="CAPACIDADE AER??BICA E MUSCULAR" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <button className="blue-button" style={{ width: '13vw', padding: 10 }}>{'PERDA DE PESO (4.5KG EM UM ANO, 6KG EM 6 MESES, 3KG EM UM M??S)'}</button>
                <button className="blue-button" style={{ width: '13vw', padding: 10 }}>{'IMC < 22Kg/m2'}</button>
                <button className="blue-button" style={{ width: '13vw', padding: 10 }}>{'CIRC. DE PANTURRILHA < 31cm'}</button>
                <button className="blue-button" style={{ width: '13vw', padding: 10 }}>{'TESTE DE VELOCIDADE > 5s'}</button>
              </div>
              <div className="title2center" style={{ marginTop: 20 }}>MARCHA</div>
              <div id="MARCHA" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <button className="blue-button" style={{ width: '13vw', padding: 10 }}>ALTERA????O DE MARCHA IMPEDE ATIVIDADES COTIDIANAS</button>
                <button className="blue-button" style={{ width: '13vw', padding: 10 }}>DUAS OU MAIS QUEDAS NO ??LTIMO ANO</button>
              </div>
              <div className="title2center" style={{ marginTop: 20 }}>CONTIN??NCIA ESFINCTERIANA</div>
              <div id="CONTIN??NCIA ESFINCTERIANA" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <button className="blue-button" style={{ width: '13vw', padding: 10 }}>INCONTIN??NCIA URIN??RIA OU FECAL</button>
              </div>
            </div>

            <div className="title4" style={{ marginTop: 20 }}>COMUNICA????O</div>
            <div id="COMUNICA????O" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <button className="blue-button" style={{ width: '13vw', padding: 10 }}>PROBLEMA DE VIS??O IMPEDE ATIVIDADES COTIDIANAS</button>
              <button className="blue-button" style={{ width: '13vw', padding: 10 }}>PROBLEMA DE AUDI????O IMPEDE ATIVIDADES COTIDIANAS</button>
            </div>

            <div className="title4" style={{ marginTop: 20 }}>COMORBIDADES M??LTIPLAS</div>
            <div id="COMORBIDADES M??LTIPLAS" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <button className="blue-button" style={{ width: '13vw', padding: 10 }}>CINCO OU MAIS DOEN??AS CR??NICAS</button>
              <button className="blue-button" style={{ width: '13vw', padding: 10 }}>CINCO OU MAIS MEDICAMENTOS DIFERENTES</button>
              <button className="blue-button" style={{ width: '13vw', padding: 10 }}>INTERNA????O NOS ??LTIMOS 6 MESES</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AptEscalaIVCF;