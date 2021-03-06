// @flow
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { Button, Message, Header } from 'semantic-ui-react';

class FormMessageError extends Component<Props> {
  render() {
    const {
      chainSymbol,
      error,
      errors,
      onClose,
      style,
      t
    } = this.props;

    const errorMessages = (errors || []);

    if (error) {
      errorMessages.push(error);
    }

    return (error || (errors && errors.length > 0))
      ? (
        <div style={style}>
          <Message negative>
            <Header>{t('error')}</Header>
            { errorMessages.map((err) => <p key={err}>{t(`error_${err}`, { chainSymbol })}</p>) }
          </Message>

          {(onClose) ? (
            <Button
              color="red"
              content={t('close')}
              fluid
              onClick={onClose}
            />) : ''}
        </div>
      ) : '';
  }
}

export default withTranslation('global')(FormMessageError);
