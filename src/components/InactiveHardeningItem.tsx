import React from 'react';
import { Link } from 'react-router-dom';

const InactiveHardeningItem = (props) => {
  const { name, description } = props;
  return (
    <div>
      <p>
        <b>{name}</b>
        <Link to="/">enable</Link>
      </p>
      <p>{description}</p>
    </div>
  );
};

export default InactiveHardeningItem;
