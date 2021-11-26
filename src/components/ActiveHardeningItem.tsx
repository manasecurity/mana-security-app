import React from 'react';
import { Link } from 'react-router-dom';

const ActiveHardeningItem = (props) => {
  const { name, description } = props;
  return (
    <div>
      <p>
        <b>{name}</b>
        <Link to="/">disable</Link>
      </p>
      <p>{description}</p>
    </div>
  )
}

export default ActiveHardeningItem;
