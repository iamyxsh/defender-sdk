import { DeployClient } from '@openzeppelin/defender-sdk-deploy-client';
import { ethers } from 'ethers';

async function main() {
  const client = new DeployClient({
    apiKey: '74EhZnRTL1MyFcYz33hyTjFybfNjhqqy',
    apiSecret: '4wQ6LYfgK8YvxtrA1tB2NFj1dUtk4kT42WGSiZ5fVFDdMkw8X3hEVB64SyXwLVyj',
  });

  // await client.deploy.deployContract({
  //   contractName: "Mock",
  //   contractPath: "contracts/Mock.sol",
  //   network: "sepolia",
  //   artifactPayload: JSON.stringify(artifactFile),
  //   licenseType: "MIT",
  //   verifySourceCode: true,
  // });

  // const txResponse = await client.relaySigner.sendTransaction({
  //   to: "0x62CA32967cc2D8857c7D2784927d6665F21cf3F8",
  //   value: 1,
  //   speed: "fast",
  //   gasLimit: "21000",
  // });

  console.log(await client.listDeployments());
}

main().catch((err) => console.log(err));
