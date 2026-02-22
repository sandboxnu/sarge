/**
 * Compose multiple refs into a single ref callback - code from Radix UI
 * @see https://github.com/radix-ui/primitives/blob/main/packages/react/compose-refs/src/compose-refs.tsx
 * Used within our drag assessment items and future kanban boards
 */

import * as React from 'react';

type PossibleRef<T> = React.Ref<T> | undefined;

/**
 * Set a given ref to a given value.
 * Handles both callback refs and RefObject(s).
 */
function setRef<T>(ref: PossibleRef<T>, value: T) {
    if (typeof ref === 'function') {
        return ref(value);
    }

    if (ref !== null && ref !== undefined) {
        ref.current = value;
    }
}

/**
 * A utility to compose multiple refs together.
 * Accepts callback refs and RefObject(s).
 */
function composeRefs<T>(...refs: PossibleRef<T>[]): React.RefCallback<T> {
    return (node) => {
        let hasCleanup = false;
        const cleanups = refs.map((ref) => {
            const cleanup = setRef(ref, node);
            if (!hasCleanup && typeof cleanup === 'function') {
                hasCleanup = true;
            }
            return cleanup;
        });

        if (hasCleanup) {
            return () => {
                for (let i = 0; i < cleanups.length; i++) {
                    const cleanup = cleanups[i];
                    if (typeof cleanup === 'function') {
                        cleanup();
                    } else {
                        setRef(refs[i], null);
                    }
                }
            };
        }
    };
}

/**
 * A custom hook that composes multiple refs.
 * Accepts callback refs and RefObject(s).
 */
function useComposedRefs<T>(...refs: PossibleRef<T>[]): React.RefCallback<T> {
    return React.useCallback((value: T) => composeRefs(...refs)(value), refs);
}

export { composeRefs, useComposedRefs };
