import { l_LL } from '@knev/bitlogr';
import { l } from '@ipsme/msgenv-broadcastchannel';
import { l as l$1 } from '@ipsme/msgcache-dedup';

const l_ = {
	// Reflector_IPC_main : 0b1 << 0,
	DUPS				: 0b1 << 1,	// duplicates
	... l_LL(l, 4),
	... l_LL(l$1, 8),
};

declare var cfg_: {
    readonly logr: any;
    options: {};
};
declare function load(window: any, str_worker_path: any, callback_INITd: any): void;

export { cfg_ as config, l_ as l, load };
