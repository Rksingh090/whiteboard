import React, { useRef } from 'react'
import Sidebar from '../components/Sidebar'


import styled from 'styled-components';
import CanvasElement from '../components/CanvasElement'

const HomeLayout = styled.main`
    width: 100%;
    height: 100vh;
    overflow: hidden;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0,5fr);
    gap: 20px;
    padding: 20px;
`


const Home = () => {


  return (
    <HomeLayout>
      <Sidebar />
      <CanvasElement />
    </HomeLayout>
  )
}

export default Home