import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addTodo } from '../actions';

const AddTodo = ({ dispatch }) => {
  let input;

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      if (!input.value.trim()) {
        return;
      }
      dispatch(addTodo(input.value));
      input.value = '';
    }}
    >
      <div className="form-group row">
        <input ref={(node) => {
          input = node;
        }}
        />
        <button className="btn btn-primary" type="submit">
        Add Todo
      </button>
      </div>
    </form>
  );
};

AddTodo.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(AddTodo);
