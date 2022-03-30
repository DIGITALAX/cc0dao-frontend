import { utils as ethersUtils } from 'ethers';
import { getMonaTokenContract } from '@services/contract.service';
import { getMonaContractAddressByChainId } from '@services/network.service';
import { convertToWei } from '@helpers/price.helpers';
import api from '@services/api/espa/api.service';

const maticAddress = '0x1c5a6720677146B27a91b5040FD1Eb25948abFC1';
const ethAddress = '0x981b2cfe8c29757c1d5e5862b6f268b9792ffa32';

class DressedActions {
  async isApproved(wallet, chainId) {
    const monaContractAddress = getMonaContractAddressByChainId(chainId);
    const contract = await getMonaTokenContract(monaContractAddress);
    let address;
    if (Number(chainId) === 1) {
      address = ethAddress;
    } else if (Number(chainId) === 137) {
      address = maticAddress;
    } else {
      return;
    }
    try {
      const allowance = await contract.methods.allowance(wallet, address).call({ from: wallet });
      const jsAllowedValue = parseFloat(ethersUtils.formatEther(allowance));
      if (jsAllowedValue < 10000000000) {
        return false;
      }
      return true;
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }

  async approveMona(wallet, chainId) {
    const monaContractAddress = getMonaContractAddressByChainId(chainId);
    const contract = await getMonaTokenContract(monaContractAddress);
    let address;
    if (Number(chainId) === 1) {
      address = ethAddress;
    } else if (Number(chainId) === 137) {
      address = maticAddress;
    } else {
      return;
    }
    try {
      await contract.methods.approve(address, convertToWei(20000000000)).send({ from: wallet });
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }

  async sendMona(wallet, chainId, value) {
    const monaContractAddress = getMonaContractAddressByChainId(chainId);
    let address;
    if (Number(chainId) === 1) {
      address = ethAddress;
    } else if (Number(chainId) === 137) {
      address = maticAddress;
    } else {
      return;
    }
    const contract = await getMonaTokenContract(monaContractAddress);
    try {
      const res = await contract.methods
        .transfer(address, convertToWei(value))
        .send({ from: wallet });
    } catch (e) {
      console.log({ e });
      throw e;
    }
  }

  async uploadImage(file) {
    try {
      let url = await api.getPresignedUrl();
      if (url) {
        const result = await api.uploadImageToS3(url, file);
        if (result) {
          // const user = getUser();
          const queryIndex = url.indexOf('?');
          if (queryIndex >= 0) {
            url = url.slice(0, queryIndex);
          }
          // user.avatar = url;
          // dispatch(this.updateProfile(user));
          return url;
        }
      }
    } catch (e) {
      throw e;
    }
  }
}

export default new DressedActions();
