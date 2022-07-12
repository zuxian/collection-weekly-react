import React from 'react';
import { Link } from 'react-router-dom';

export default function Card (props) {
  const { data: { count = '' } } = props;
  return (
    <li className="weekly__item">
      <Link
        to={`detail/${count}`}
        className="weekly__item__url"
        target="_blank"
      >
        <img
          src={`/static/images/${count+20}.png`}
          alt={`第${count}期封面图`}
          className="weekly__item__cover lazy"
        />
        <h3 className="weekly__item__title">收藏周刊第 {count} 期</h3>
      </Link>
    </li>
  );
}
