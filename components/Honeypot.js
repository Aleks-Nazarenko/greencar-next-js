// Spam trap for forms: a field people can't see or reach with Tab, so only bots fill it in.
// The form sends it as "website"; the Joomla API answers "success" for those requests but does nothing.
export default function Honeypot() {
    return (
        <div aria-hidden="true" style={{position: "absolute", left: "-10000px", width: "1px", height: "1px", overflow: "hidden"}}>
            <label htmlFor="hpWebsite">Website</label>
            <input type="text" id="hpWebsite" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </div>
    );
}

// Value of the honeypot field in a submitted form
export const honeypotValue = (form) => form?.elements?.website?.value ?? '';
