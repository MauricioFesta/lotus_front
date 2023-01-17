/* tslint:disable */
/* eslint-disable */
/**
 * @param {string} token
 * @param {number} pagged_end
 * @param {number} pagged
 * @returns {Promise<any>}
 */
export function get_vagas(
  token: string,
  pagged_end: number,
  pagged: number,
): Promise<any>;
/**
 * @param {string} token
 * @returns {Promise<any>}
 */
export function length_vagas_empresa_abertas(token: string): Promise<any>;
/**
 * @param {string} token
 * @returns {Promise<any>}
 */
export function length_vagas_empresa_fechados(token: string): Promise<any>;
/**
 * @param {string} token
 * @returns {Promise<any>}
 */
export function get_length_vagas(token: string): Promise<any>;
/**
 * @param {string} token
 * @param {number} pagged_end
 * @param {number} pagged
 * @returns {Promise<any>}
 */
export function get_vagas_empresa(
  token: string,
  pagged_end: number,
  pagged: number,
): Promise<any>;
/**
 * @param {string} token
 * @param {number} pagged_end
 * @param {number} pagged
 * @returns {Promise<any>}
 */
export function get_vagas_empresa_fechado(
  token: string,
  pagged_end: number,
  pagged: number,
): Promise<any>;
/**
 * @param {string} token
 * @returns {Promise<any>}
 */
export function get_postagens_empresa(token: string): Promise<any>;
/**
 * @param {string} token
 * @returns {Promise<any>}
 */
export function get_postagens_all(token: string): Promise<any>;
/**
 * @param {string} token
 * @returns {Promise<any>}
 */
export function get_perfil(token: string): Promise<any>;
/**
 * @param {string} id
 * @param {string} token
 * @returns {Promise<any>}
 */
export function list_candidatos_vagas(id: string, token: string): Promise<any>;
/**
 * @param {string} token
 * @returns {Promise<any>}
 */
export function get_notificacoes(token: string): Promise<any>;
/**
 * @param {string} token
 * @returns {Promise<any>}
 */
export function get_curriculos(token: string): Promise<any>;

export type InitInput =
  | RequestInfo
  | URL
  | Response
  | BufferSource
  | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly get_vagas: (a: number, b: number, c: number, d: number) => number;
  readonly length_vagas_empresa_abertas: (a: number, b: number) => number;
  readonly length_vagas_empresa_fechados: (a: number, b: number) => number;
  readonly get_length_vagas: (a: number, b: number) => number;
  readonly get_vagas_empresa: (
    a: number,
    b: number,
    c: number,
    d: number,
  ) => number;
  readonly get_vagas_empresa_fechado: (
    a: number,
    b: number,
    c: number,
    d: number,
  ) => number;
  readonly get_postagens_empresa: (a: number, b: number) => number;
  readonly get_postagens_all: (a: number, b: number) => number;
  readonly get_perfil: (a: number, b: number) => number;
  readonly list_candidatos_vagas: (
    a: number,
    b: number,
    c: number,
    d: number,
  ) => number;
  readonly get_notificacoes: (a: number, b: number) => number;
  readonly get_curriculos: (a: number, b: number) => number;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly _dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h1392e9c959a3b010:
    (a: number, b: number, c: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly wasm_bindgen__convert__closures__invoke2_mut__h87b55fb2e571761d: (
    a: number,
    b: number,
    c: number,
    d: number,
  ) => void;
}

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {InitInput | Promise<InitInput>} module_or_path
 *
 * @returns {Promise<InitOutput>}
 */
export default function init(
  module_or_path?: InitInput | Promise<InitInput>,
): Promise<InitOutput>;
