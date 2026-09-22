import { createSeed } from './seed'

export function providerStaticParams () {
  return createSeed().providers.map((provider) => ({ id: provider.id }))
}

export function offeringStaticParams () {
  return createSeed().offerings.map((offering) => ({ id: offering.id }))
}
