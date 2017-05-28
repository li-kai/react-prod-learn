import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Todo = ({ onClick, completed, text }) => {
  const btnClass = classNames('btn', {
    'btn-success': completed,
    'btn-secondary': !completed,
  });
  return (
    <li>
      <button
        className={btnClass}
        onClick={onClick}
      >
        {text}
      </button>
    </li>
  );
};


Todo.propTypes = {
  onClick: PropTypes.func.isRequired,
  completed: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
};

export default Todo;
