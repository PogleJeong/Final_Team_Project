import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';
import Home from './component/Home.js';
import Nav from './component/Nav.js';


import Login from './router/login/Login.js';
import Regi from './router/login/Regi.js';
import Pet_info from './router/login/Pet_info.js';
import Pet_info_detail from './router/login/Pet_info_detail.js';

import Place from './router/place/Place.js';
import Place_Detail from './router/place/Place_Detail.js';

import Myfeed from './router/myfeed/Myfeed';
import User_update from './router/myfeed/User_update';
import Pet_update from './router/myfeed/Pet_update';
import MarketHome from './router/market/Market_home';
import MarketWrite from './router/market/Market_write';
import MarketUpdate from './router/market/Market_update';
import MarketDetail from './router/market/Market_detail';
import Admin from './router/admin/Admin';
import QnA from './router/admin/QnA';
import Reports from './router/admin/Reports';
import Users from './router/admin/Users';
import Data from './router/admin/Data';



function App() {
  return (
    <div>
      {/* 헤더 */}
      <header>
        <div>
          <h1>PAW-TENTIAL</h1>
        </div>
      </header>
      <BrowserRouter>
      <div>
        <nav>
          {/* 사이드메뉴 */}
          <div> 
            <Nav />
          </div>
        </nav>
        <main>
          <Routes>
            {/* 메인 홈 */}
            <Route path="/" element={<Home />} />

            {/* 로그인/회원가입 */}
            <Route path="/login/login" element={<Login />} />
            <Route path="/login/regi" element={<Regi />} />
            <Route path="/login/pet_info" element={<Pet_info />} />
            <Route path="/login/pet_info_detail" element={<Pet_info_detail />} />

            {/* 피드 */}
            <Route path="/router/regi" element={<Regi />} />
            <Route path="/router/regi" element={<Regi />} />
            <Route path="/router/regi" element={<Regi />} />

            {/* 콘테스트 */}
            <Route path="/router/regi" element={<Regi />} />
            <Route path="/router/regi" element={<Regi />} />

            {/* 포텐스 */}
            <Route path="/router/regi" element={<Regi />} />

            {/* 마켓 */}
            <Route path="/market" element={<MarketHome />} />
            <Route path="/market/write" element={<MarketWrite />} />
            <Route path="/market/update" element={<MarketUpdate />} />
            <Route path="/market/detail" element={<MarketDetail />} />

            {/* 채팅 */}
            <Route path="/router/regi" element={<Regi />} />

            {/* 플레이스 */}
            <Route path="/place/place" element={<Place />} />
            <Route path="/place/place-detail" element={<Place_Detail />} />

            {/* 그룹 */}
            <Route path="/router/regi" element={<Regi />} />
            <Route path="/router/regi" element={<Regi />} />
            <Route path="/router/regi" element={<Regi />} />
            <Route path="/router/regi" element={<Regi />} />
            <Route path="/router/regi" element={<Regi />} />
            <Route path="/router/regi" element={<Regi />} />
            <Route path="/router/regi" element={<Regi />} />

            {/* 관리자 */}
            <Route path="admin/admin" element={<Admin />} />
            <Route path="admin/users" element={<Users />} />
            <Route path="admin/users/:choice/:search" element={<Users />} />
            <Route path="admin/QnA" element={<QnA />} />
            <Route path="admin/QnA/:choice/:search" element={<QnA />} />
            <Route path="admin/reports" element={<Reports />} />
            <Route path="admin/reports/:choice/:search" element={<Reports />} />
            <Route path="admin/data" element={<Data />} />

            

            {/* 마이피드 */}
            <Route path="/myfeed/myfeed" element={<Myfeed />} />
            <Route path="/myfeed/user_update" element={<User_update />} />
            <Route path="/myfeed/pet_update" element={<Pet_update />} />
          </Routes>

        </main>
        </div>
      </BrowserRouter>
   
      {/* footer */}
      <footer>
        <div>
          <p>
            <small>Copyright &copy;Paw-Tential</small>
          </p>
        </div>
      </footer>
    </div>
  );

}

export default App;