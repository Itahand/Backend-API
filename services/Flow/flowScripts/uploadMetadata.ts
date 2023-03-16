/** @format */

export const uploadMetadata = () => {
  return `
  import Pieces_3 from 0x1ad3c2a8a0bca093

  transaction(
    _twitterId: UInt64,
    _description: String,
    _url: String
  ) {
    let Administrator: &Pieces_3.Administrator
    prepare(deployer: AuthAccount) {
      self.Administrator = deployer.borrow<&Pieces_3.Administrator>(from: Pieces_3.AdministratorStoragePath)
                           ?? panic("This account is not the Administrator.")
   }

    execute {

        self.Administrator.createNFTMetadata(
          twitterId: _twitterId,
          description: _description,
          url: _url
          extra: {"Id": "TwitterId"}
        )
    }
  }
  `;
};
