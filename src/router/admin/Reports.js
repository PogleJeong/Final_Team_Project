import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Card, Avatar } from 'antd';
import axios from 'axios';

const { Meta } = Card;

const SearchUser = () => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleUserClick = (userId) => {
    navigate(`/myfeed/${userId}`); // 검색된 유저의 MyFeed 페이지로 이동
  };

  useEffect(() => {
    let timer;
    if (searchText !== '') {
      // 입력이 멈춘 후 500ms 이후에 검색 수행
      timer = setTimeout(() => {
        const userId = searchText.trim();
        searchUser(userId);
      }, 500);
    }

    return () => {
      clearTimeout(timer); // 컴포넌트가 unmount 되면 타이머 클리어
    };
  }, [searchText]);

  const searchUser = (userId) => {
    axios
      .get('http://localhost:3000/reportList', { params: { 'choice': 'id', 'search': userId } })
      .then((response) => {
        setSearchResults(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <Input.Search
        placeholder="아이디 검색"
        value={searchText}
        onChange={handleSearch}
      />

      {searchResults.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          {searchResults.map((user) => (
            <Card
              key={user.id}
              style={{ width: 200, display: 'inline-block', margin: '10px' }}
              cover={<img alt="프로필 이미지" src={user.profile} />}
              onClick={() => handleUserClick(user.id)}
            >
              <Meta
                avatar={<Avatar src={user.profile} />}
                title={user.nickname}
                description={user.intro}
              />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchUser;
