// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import compose from 'lodash/fp/compose';
import { findIndex } from 'lodash';
import { Button, Dropdown, Header, Icon, Input, Segment, Tab } from 'semantic-ui-react';

import GlobalButtonElevate from '../Button/Elevate';
import GlobalFragmentWallet from '../../../components/Global/Fragment/Wallet';
import * as WalletActions from '../../../actions/wallet';
import * as WalletsActions from '../../../actions/wallets';

class GlobalAccountDropdown extends Component<Props> {
  state = { open: false }
  onClose = () => {
    this.setState({ open: false });
  }
  onOpen = () => {
    this.setState({ open: true });
  }
  onToggle = () => {
    this.setState({ open: !this.state.open });
  }
  swapAccount = (account, authorization, password = false) => {
    const { actions, settings } = this.props;
    actions.useWallet(settings.chainId, account, authorization);
    if (password) {
      actions.unlockWallet(password);
    }
  }
  render() {
    const {
      auths,
      fluid,
      selection,
      settings,
      style,
      t,
      validate,
      wallet,
      wallets
    } = this.props;
    if (!wallets || wallets.length === 0) {
      return false;
    }
    let { chainId } = settings;
    const options = wallets
      .filter(w => (
        w.chainId === chainId
        && (
          w.account !== wallet.account
          || w.authorization !== wallet.authorization
        )
      ))
      .sort((a, b) => a.account > b.account);
    let trigger = (
      <GlobalFragmentWallet
        account={wallet.account}
        authorization={wallet.authorization}
        mode={wallet.mode}
        pubkey={wallet.pubkey}
      />
    );
    if (!settings.account) {
      trigger = (
        <Header
          content="No account selected"
          subheader="Choose an account to use"
          size="small"
          style={{ margin: 0 }}
        />
      );
    }
    return (
      <Dropdown
        fluid={fluid}
        item={!selection}
        labeled
        selection={selection}
        style={style || {}}
        trigger={trigger}
      >
        <Dropdown.Menu key="parent">
          <Dropdown.Menu key="menu" scrolling>
            {(options.length > 0)
              ? options.map(w => {
                const { pubkey } = w;
                const unlocked = (findIndex(auths, { pubkey }) >= 0);
                if (w.mode === 'watch' || w.mode === 'ledger' || unlocked) {
                  return (
                    <Dropdown.Item
                      onClick={() => this.swapAccount(w.account, w.authorization)}
                      key={`${w.account}@${w.authorization}`}
                    >
                      <GlobalFragmentWallet
                        account={w.account}
                        authorization={w.authorization}
                        mode={w.mode}
                        pubkey={w.pubkey}
                      />
                    </Dropdown.Item>
                  );
                }
                return (
                  <GlobalButtonElevate
                    onSuccess={(password) => this.swapAccount(w.account, w.authorization, password)}
                    settings={settings}
                    trigger={(
                      <Dropdown.Item>
                        <GlobalFragmentWallet
                          account={w.account}
                          authorization={w.authorization}
                          mode={w.mode}
                          pubkey={w.pubkey}
                        />
                      </Dropdown.Item>
                    )}
                    validate={validate}
                    wallet={w}
                  />
                );
              })
              : (
                <Dropdown.Item
                  content={(
                    <p>{t('global_accounts_dropdown_no_accounts')}</p>
                  )}
                  key="empty"
                  style={{
                    lineHeight: '1.25em',
                    width: '300px',
                    maxWidth: '300px',
                    padding: '1em',
                    whiteSpace: 'normal'
                  }}
                />
              )
            }
          </Dropdown.Menu>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}


function mapStateToProps(state) {
  return {
    auths: state.auths,
    settings: state.settings,
    validate: state.validate,
    wallet: state.wallet,
    wallets: state.wallets
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...WalletActions,
      ...WalletsActions,
    }, dispatch)
  };
}

export default compose(
  translate('global'),
  connect(mapStateToProps, mapDispatchToProps)
)(GlobalAccountDropdown);
