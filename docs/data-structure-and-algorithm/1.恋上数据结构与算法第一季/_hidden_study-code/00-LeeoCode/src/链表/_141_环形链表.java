package 链表;

/**
 * https://leetcode.cn/problems/linked-list-cycle/
 */
public class _141_环形链表 {
  public boolean hasCycle(ListNode head) {
    if (head == null || head.next == null)
      return false;

    ListNode slow = head;
    ListNode fast = head.next;

    while (fast != null && fast.next != null) {
      if (slow == fast)
        return true;

      slow = slow.next;
      fast = fast.next.next;
    }

    return false;
  }
}
