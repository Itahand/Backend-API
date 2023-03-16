/** @format */

export const mintNFT = () => {
  return `
  import NonFungibleToken from 0x631e88ae7f1d7c20
  import Pieces_3 from 0x1ad3c2a8a0bca093
  import MetadataViews from 0x631e88ae7f1d7c20

  transaction(_metadataId: UInt64, _recipient: Address) {

    let Administrator: &Pieces_3.Administrator

    prepare(admin: AuthAccount) {
        // Confirm Admin
        self.Administrator = admin.borrow<&Pieces_3.Administrator>(from: Pieces_3.AdministratorStoragePath)
                          ?? panic("This account is not the Administrator.")
    }

    execute {
        self.Administrator.mintNFT(metadataId: _metadataId, recipient: _recipient)
    }


  }
  `;
};
