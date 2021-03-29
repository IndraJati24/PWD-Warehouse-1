import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
// import * as Opencage from 'opencage-api-client';
import Opencage from 'opencage-api-client/dist/opencage-api.min';
import PropTypes from 'prop-types';
import debounce from "lodash.debounce";
import './opencage.css';

class OpencageAutocomplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      suggestions: [],
      isLoading: false,
    };
    const {
      getSuggestionValue,
      onSuggestionSelected,
      renderSuggestion,
    } = this.props;
    this.onChange = this.onChange.bind(this);
    this.fetchSuggestions = this.fetchSuggestions.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(
      this
    );
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(
      this
    );
    if (getSuggestionValue) {
      this.getSuggestionValue = getSuggestionValue;
    } else {
      this.getSuggestionValue = this.getSuggestionValue.bind(this);
    }
    if (onSuggestionSelected) {
      this.onSuggestionSelected = onSuggestionSelected;
    } else {
      this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
    }
    if (renderSuggestion) {
      this.renderSuggestion = renderSuggestion;
    } else {
      this.renderSuggestion = this.renderSuggestion.bind(this);
    }
  }

  onChange(event, { newValue }) {
    this.setState({
      value: newValue,
    });
  }

  fetchSuggestions=debounce((value)=>{
    Opencage.geocode({
      q: value,
      key: this.props.apiKey,
      proxyURL: this.props.proxyURL,
    })
      .then(data => {
        // console.log(JSON.stringify(data));
        if (data.status.code === 200) {
          if (data.results.length > 0) {
            this.setState({ suggestions: data.results });
          }
        } else {
          this.setState({ suggestions: [] });
          // eslint-disable-next-line
          console.log('[OCA] error', data.status.message);
        }
      })
      .catch(error => {
        this.setState({ suggestions: [] });
        // eslint-disable-next-line
        console.log('[OCA] error', error.message);
      });
  },700)

  onSuggestionsFetchRequested({ value }) {
    this.fetchSuggestions(value);
  }

  onSuggestionsClearRequested() {
    this.setState({
      suggestions: [],
    });
  }

  // eslint-disable-next-line
  getSuggestionValue(suggestion) {
    return suggestion.formatted;
  }

  onSuggestionSelected(event, { suggestion }) {
    if (this.props.debug) {
      // eslint-disable-next-line
      console.log('Suggestion Selected is', suggestion);
    }
  }

  // eslint-disable-next-line
  renderSuggestion(suggestion) {
    return (
      <div>
        <span>{suggestion.annotations.flag}</span>
        &nbsp;
        <span>{suggestion.formatted}</span>
      </div>
    );
  }

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: this.props.placeholder || 'address',
      value,
      onChange: this.onChange,
    };
    return (
      <div className="opencage-wrapper">
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          onSuggestionSelected={this.onSuggestionSelected}
          inputProps={inputProps}
        />
      </div>
    );
  }
}
OpencageAutocomplete.propTypes = {
  apiKey: PropTypes.string,
  proxyURL: PropTypes.string,
  placeholder: PropTypes.string,
  debug: PropTypes.bool,
  getSuggestionValue: PropTypes.func,
  renderSuggestion: PropTypes.func,
  onSuggestionSelected: PropTypes.func,
};

export default OpencageAutocomplete;