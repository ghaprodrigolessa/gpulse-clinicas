// PAINEL DE CONTROLE (MAR/21)

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
import Atendimentos from '../pages/Atendimentos'


export function Stuff() {

  // contexto.
  const {
    todospacientes,
    todosleitos,
    todosatendimentos,
  } = useContext(Context)

  var atendimentos = [0, 1];
  atendimentos = todosatendimentos;
  // alert(atendimentos.length);

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingTop: 7.5, paddingBottom: 7.5,
      }}>
      <button
        className="blue-button"
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: window.innerWidth > 800 ? 150 : 50,
          height: window.innerWidth > 800 ? 150 : 50,
          margin: 5,
          padding: 5,
        }}
      >
        <div style={{ flexDirection: 'column' }}>
          {'TOTAL DE INTERNAÇÕES: '}
        </div>
        <div style={{ flexDirection: 'column', color: 'yellow' }}>
          {atendimentos.length}
        </div>
      </button>
      <button
        className="blue-button"
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: window.innerWidth > 800 ? 150 : 50,
          height: window.innerWidth > 800 ? 150 : 50,
          margin: 5,
          padding: 5,
        }}
      >
        <div style={{ flexDirection: 'column' }}>
          {'INTERNAÇÕES NO DIA: '}
        </div>
        <div style={{ flexDirection: 'column', color: 'yellow' }}>
          {atendimentos.filter(item => moment(item.dt_hr_atendimento, 'YYYY-MM-DD').format('YYYY-MM-DD') == moment().format()).length}
        </div>
      </button>
      <button
        className="blue-button"
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: window.innerWidth > 800 ? 150 : 50,
          height: window.innerWidth > 800 ? 150 : 50,
          margin: 5,
          padding: 5,
        }}
      >
        <div style={{ flexDirection: 'column' }}>
          {'ALTAS NO DIA: '}
        </div>
        <div style={{ flexDirection: 'column', color: 'yellow' }}>
          {atendimentos.filter(item => moment(item.dt_hr_alta, 'YYYY-MM-DD').format('YYYY-MM-DD') == moment().format()).length}
        </div>
      </button>
      <button
        className="blue-button"
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: window.innerWidth > 800 ? 150 : 50,
          height: window.innerWidth > 800 ? 150 : 50,
          margin: 5,
          padding: 5,
        }}
      >
        <div style={{ flexDirection: 'column' }}>
          {'NÚMERO DE COLABORADORES: '}
        </div>
        <div style={{ flexDirection: 'column', color: 'yellow' }}>
          {'???'}
        </div>
      </button>
      <button
        className="blue-button"
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: window.innerWidth > 800 ? 150 : 50,
          height: window.innerWidth > 800 ? 150 : 50,
          margin: 5,
          padding: 5,
        }}
      >
        <div style={{ flexDirection: 'column' }}>
          {'ÓBITOS NO DIA: '}
        </div>
        <div style={{ flexDirection: 'column', color: 'yellow' }}>
        {'???'}
        </div>
      </button>
      <button
        className="blue-button"
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: window.innerWidth > 800 ? 150 : 50,
          height: window.innerWidth > 800 ? 150 : 50,
          margin: 5,
          padding: 5,
        }}
      >
        <div style={{ flexDirection: 'column' }}>
          {'INFECÇÕES REGISTRADAS: '}
        </div>
        <div style={{ flexDirection: 'column', color: 'yellow' }}>
        {'???'}
        </div>
      </button>
      <button
        className="blue-button"
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: window.innerWidth > 800 ? 150 : 50,
          height: window.innerWidth > 800 ? 150 : 50,
          margin: 5,
          padding: 5,
        }}
      >
        <div style={{ flexDirection: 'column' }}>
          {'PACIENTES COM RISCO DE SEPSE: '}
        </div>
        <div style={{ flexDirection: 'column', color: 'yellow' }}>
        {'???'}
        </div>
      </button>
      <button
        className="blue-button"
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: window.innerWidth > 800 ? 150 : 50,
          height: window.innerWidth > 800 ? 150 : 50,
          margin: 5,
          padding: 5,
        }}
      >
        <div style={{ flexDirection: 'column' }}>
          {'TICKET MÉDIO DE TEMPO DE INTERNAÇÃO: '}
        </div>
        <div style={{ flexDirection: 'column', color: 'yellow' }}>
          {'3 DIAS'}
        </div>
      </button>
      <button
        className="blue-button"
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: window.innerWidth > 800 ? 150 : 50,
          height: window.innerWidth > 800 ? 150 : 50,
          margin: 5,
          padding: 5,
        }}
      >
        <div style={{ flexDirection: 'column' }}>
          {'INTERNAÇÕES ORIUNDAS DA URGÊNCIA: '}
        </div>
        <div style={{ flexDirection: 'column', color: 'yellow' }}>
          {5}
        </div>
      </button>
      <button
        className="blue-button"
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: window.innerWidth > 800 ? 150 : 50,
          height: window.innerWidth > 800 ? 150 : 50,
          margin: 5,
          padding: 5,
        }}
      >
        <div style={{ flexDirection: 'column' }}>
          {'REINTERNAÇÕES NAS ÚLTIMAS 24H: '}
        </div>
        <div style={{ flexDirection: 'column', color: 'yellow' }}>
          {'2'}
        </div>
      </button>
      <button
        className="blue-button"
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: window.innerWidth > 800 ? 150 : 50,
          height: window.innerWidth > 800 ? 150 : 50,
          margin: 5,
          padding: 5,
        }}
      >
        <div style={{ flexDirection: 'column' }}>
          {'MÉDIA DE OCUPAÇÃO: '}
        </div>
        <div style={{ flexDirection: 'column', color: 'yellow' }}>
          {'60/100'}
        </div>
      </button>
      <button
        className="blue-button"
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: window.innerWidth > 800 ? 150 : 50,
          height: window.innerWidth > 800 ? 150 : 50,
          margin: 5,
          padding: 5,
        }}
      >
        <div style={{ flexDirection: 'column' }}>
          {'TOTAL DE LEITOS: '}
        </div>
        <div style={{ flexDirection: 'column', color: 'yellow' }}>
          {'100'}
        </div>
      </button>
      <button
        className="blue-button"
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: window.innerWidth > 800 ? 150 : 50,
          height: window.innerWidth > 800 ? 150 : 50,
          margin: 5,
          padding: 5,
        }}
      >
        <div style={{ flexDirection: 'column' }}>
          {'LEITOS OCUPADOS: '}
        </div>
        <div style={{ flexDirection: 'column', color: 'yellow' }}>
          {60}
        </div>
      </button>
      <button
        className="blue-button"
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: window.innerWidth > 800 ? 150 : 50,
          height: window.innerWidth > 800 ? 150 : 50,
          margin: 5,
          padding: 5,
        }}
      >
        <div style={{ flexDirection: 'column' }}>
          {'LEITOS VAGOS:'}
        </div>
        <div style={{ flexDirection: 'column', color: 'yellow' }}>
          {40}
        </div>
      </button>
      <button
        className="blue-button"
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: window.innerWidth > 800 ? 150 : 50,
          height: window.innerWidth > 800 ? 150 : 50,
          margin: 5,
          padding: 5,
        }}
      >
        <div style={{ flexDirection: 'column' }}>
          {'LEITOS EM LIMPEZA:'}
        </div>
        <div style={{ flexDirection: 'column', color: 'yellow' }}>
          {2}
        </div>
      </button>
      <button
        className="blue-button"
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: window.innerWidth > 800 ? 150 : 50,
          height: window.innerWidth > 800 ? 150 : 50,
          margin: 5,
          padding: 5,
        }}
      >
        <div style={{ flexDirection: 'column' }}>
          {'LEITOS INTERDITADOS:'}
        </div>
        <div style={{ flexDirection: 'column', color: '#yellow' }}>
          {0}
        </div>
      </button>
      <button
        className="blue-button"
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: window.innerWidth > 800 ? 150 : 50,
          height: window.innerWidth > 800 ? 150 : 50,
          margin: 5,
          padding: 5,
        }}
      >
        <div style={{ flexDirection: 'column' }}>
          {'LEITOS EM MANUTENÇÃO:'}
        </div>
        <div style={{ flexDirection: 'column', color: '#yellow' }}>
          {0}
        </div>
      </button>
      <button
        className="blue-button"
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: window.innerWidth > 800 ? 150 : 50,
          height: window.innerWidth > 800 ? 150 : 50,
          margin: 5,
          padding: 5,
        }}
      >
        <div style={{ flexDirection: 'column' }}>
          {'LEITOS DESATIVADOS:'}
        </div>
        <div style={{ flexDirection: 'column', color: '#yellow' }}>
          {0}
        </div>
      </button>
    </div>
  );
}