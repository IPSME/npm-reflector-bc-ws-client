
import { l_LL } from '@knev/bitlogr';
import { l as ipsme_msgenv_l } from '@ipsme/msgenv-broadcastchannel';
import { l as msgcache_l } from '@ipsme/msgcache-dedup';

const l_ = {
	// Reflector_IPC_main : 0b1 << 0,
	DUPS				: 0b1 << 1,	// duplicates
	... l_LL(ipsme_msgenv_l, 4),
	... l_LL(msgcache_l, 8),
}

//-------------------------------------------------------------------------------------------------

export { l_ };