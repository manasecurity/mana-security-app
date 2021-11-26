import nowUnixTime from './nowUnixTime';

const COLD_REPO_TTL = 24 * 60 * 60; // 24 hours in seconds
// const COLD_REPO_TTL = 1; // 1 second in seconds

export default function coldRepoExpired(lastFetchOfColdRepo) {
  const nowUtc = nowUnixTime();
  return nowUtc - lastFetchOfColdRepo > COLD_REPO_TTL;
}
