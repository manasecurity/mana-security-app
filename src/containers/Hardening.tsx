import React from 'react';
import ActiveHardeningItem from '../components/ActiveHardeningItem';
import InactiveHardeningItem from '../components/InactiveHardeningItem';

const Hardening = () => {
  return (
    <div>
      <h1>Recommended hardening policies</h1>
      <InactiveHardeningItem
        name="FileVault is disabled."
        description="When enabled, all Mac’s data will be encrypted, so nobody will be able to access your photos or private docs."
      />
      <ActiveHardeningItem
        name="System password is set"
        description="Your computer is useless for attackers if they have access to it without the system password."
      />
      <ActiveHardeningItem
        name="Firewall is enabled"
        description="Attackers in the same Wi-Fi network might find ways to intrude the computer without your knowledge. Enabling firewall makes your laptop invisible for such attacks."
      />
    </div>
  );
};

export default Hardening;
