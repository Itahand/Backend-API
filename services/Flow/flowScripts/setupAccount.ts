/** @format */

export const setupAccount = () => {
  return `
import NonFungibleToken from 0x631e88ae7f1d7c20
import Pieces_4 from 0x1ad3c2a8a0bca093
import MetadataViews from 0x631e88ae7f1d7c20

// This transaction configures an account to hold a Pieces_4 NFT.

transaction {
    prepare(signer: AuthAccount) {
        // if the account doesn't already have a collection
        if signer.borrow<&Pieces_4.Collection>(from: Pieces_4.CollectionStoragePath) == nil {

            // create a new empty collection
            let collection <- Pieces_4.createEmptyCollection()

            // save it to the account
            signer.save(<-collection, to: Pieces_4.CollectionStoragePath)

            // create a public capability for the collection
            signer.link<&Pieces_4.Collection{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, MetadataViews.ResolverCollection}>(Pieces_4.CollectionPublicPath, target: Pieces_4.CollectionStoragePath)
        }
    }
}
  `;
};
