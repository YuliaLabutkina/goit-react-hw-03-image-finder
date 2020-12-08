import { Component } from 'react';
import PropTypes from 'prop-types';
import {
  SearchbarContainer,
  SearchForm,
  SearchFormButton,
  SearchFormButtonLabel,
  SearchFormInput,
} from './SearchbarStyle';

class Searchbar extends Component {
  state = {
    search: '',
  };

  handelSearch = ({ target }) => {
    const { value } = target;
    this.setState({ search: value });
  };

  handleSubmit = event => {
    event.preventDefault();
    const { search } = this.state;
    this.props.onSubmitForm(search);
    this.reset();
  };

  reset = () => {
    this.setState({ search: '' });
  };

  render() {
    const { search } = this.state;

    return (
      <SearchbarContainer>
        <SearchForm onSubmit={this.handleSubmit}>
          <SearchFormButton type="submit">
            <SearchFormButtonLabel>Search</SearchFormButtonLabel>
          </SearchFormButton>
          <SearchFormInput
            onChange={this.handelSearch}
            value={search}
            type="text"
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos"
          />
        </SearchForm>
      </SearchbarContainer>
    );
  }
}

Searchbar.propTypes = {
  onSubmitForm: PropTypes.func.isRequired,
};

export default Searchbar;
