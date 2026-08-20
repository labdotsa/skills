<script lang="ts">
  import { afterNavigate } from "$app/navigation";
  import { buildHokoTrackingScriptUrl } from "$lib/domain/hoko-tracking.js";

  const SCRIPT_ATTRIBUTE = "data-hoko-tracking";

  afterNavigate(() => {
    document.querySelector(`script[${SCRIPT_ATTRIBUTE}]`)?.remove();
    if (window.location.hostname !== "skills.lab.sa") return;

    const script = document.createElement("script");
    script.src = buildHokoTrackingScriptUrl(new URL(window.location.href));
    script.async = true;
    script.setAttribute(SCRIPT_ATTRIBUTE, "");
    document.head.appendChild(script);
  });
</script>
